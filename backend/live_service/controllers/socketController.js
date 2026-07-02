const jwt = require('jsonwebtoken');
const Message = require('../models/Message');

const handleSocketConnection = (socket) => {
    console.log(`New client connected: ${socket.id}`);


    // Il client invia il JWT appena connesso. Il server lo valida.
    socket.on('authenticate', (data) => {
        console.log(`Authenticate event received from ${socket.id}`);
        try {
            if (!data || !data.token) {
                socket.emit('unauthorized', { message: 'Token mancante' });
                return socket.disconnect();
            }

            const token = data.token;
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_secret');


            socket.user = decoded;
            socket.token = token;

            const userId = decoded.id || decoded.userId;
            if (userId) {
                const userRoom = `user_${userId}`;
                socket.join(userRoom);
                console.log(`Client ${socket.id} (User: ${userId}) subscribed to personal room: ${userRoom}`);
            }

            socket.emit('authenticated', { message: 'Autenticazione Socket completata con successo' });
            console.log(`Client ${socket.id} successfully authenticated`);
        } catch (error) {
            console.error(`Socket JWT validation error for ${socket.id}:`, error.message);
            socket.emit('unauthorized', { message: 'Token non valido o scaduto' });
            socket.disconnect();
        }
    });

    // Il client chiede di entrare nella stanza virtuale di un corso.
    socket.on('join_course_room', (data) => {
        console.log(`Join_course_room event received from ${socket.id}`);

        if (!socket.user || !socket.token) {
            console.log(`Client ${socket.id} not authenticated. Join rejected.`);
            return socket.emit('unauthorized', { message: 'Autenticazione richiesta per unirsi alla stanza' });
        }

        const courseId = data && data.courseId;
        if (!courseId) {
            console.log(`Missing data for join_course_room from ${socket.id}`);
            return socket.emit('error', { message: 'courseId mancante nel payload' });
        }

        const gymServiceUrl = process.env.GYM_SERVICE_URL || 'http://gym-service:5002';
        fetch(`${gymServiceUrl}/api/v1/gym/courses?enrolled=true`, {
            headers: {
                'Authorization': `Bearer ${socket.token}`
            }
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Errore HTTP dal Gateway: ${response.status}`);
                }
                return response.json();
            })
            .then(responseData => {
                const myCourses = responseData.data || [];

                // Verifica se il courseId è tra i corsi in cui l'utente è iscritto
                // Controlla sia ._id (Mongoose default) sia .id
                const isEnrolled = myCourses.some(course => course._id === courseId || course.id === courseId);

                if (!isEnrolled) {
                    console.log(`Client ${socket.id} not enrolled in course ${courseId}. Join rejected.`);
                    return socket.emit('error', { message: 'Utente non iscritto a questo corso' });
                }

                const roomName = `course_${courseId}`;
                socket.join(roomName);
                console.log(`Client ${socket.id} (User: ${socket.user.id || 'Unknown'}) joined room ${roomName}`);

                socket.emit('room_joined', { courseId, roomName, message: `Unito con successo alla stanza ${roomName}` });
            })
            .catch(error => {
                console.error(`Error during enrollment verification for ${socket.id}:`, error.message);
                socket.emit('error', { message: 'Errore interno durante la verifica dell\'iscrizione' });
            });
    });

    // L'utente invia un messaggio chat. Il server lo salva su DB e inoltra.
    socket.on('send_message', (data) => {
        console.log(`Send_message event received from ${socket.id}`);

        if (!socket.user || (!socket.user.id && !socket.user.userId)) {
            return socket.emit('error', { message: 'Autenticazione richiesta per inviare messaggi' });
        }

        const senderId = socket.user.id || socket.user.userId;
        const senderName = data && data.senderName || 'Utente';
        const courseId = data && data.courseId;
        const content = data && data.content;

        if (!courseId || !content) {
            return socket.emit('error', { message: 'Payload non valido: courseId e content sono obbligatori' });
        }

        const newMessage = new Message({
            courseId,
            senderId,
            senderName,
            content
        });

        newMessage.save()
            .then(savedMessage => {
                const roomName = `course_${courseId}`;
                socket.to(roomName).emit('receive_message', savedMessage);
            })
            .catch(error => {
                console.error(`Error saving message for ${socket.id}:`, error.message);
                socket.emit('error', { message: 'Errore interno durante l\'invio del messaggio' });
            });
    });

    socket.on('disconnect', () => {
        console.log(`Client disconnected: ${socket.id}`);
    });
};

module.exports = {
    handleSocketConnection
};
