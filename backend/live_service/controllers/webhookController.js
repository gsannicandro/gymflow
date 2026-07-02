const handleWebhookNotify = (req, res) => {
    try {
        const payload = req.body;

        if (!payload || !payload.event) {
            return res.status(400).json({ message: 'Payload non valido. Campo "event" richiesto.' });
        }

        
        if (payload.userIds && Array.isArray(payload.userIds)) {
            // Notifica in blocco (batch) a più utenti
            payload.userIds.forEach(id => {
                req.io.to(`user_${id}`).emit(payload.event, payload);
            });
            console.log(`Batch Socket.IO event sent to ${payload.userIds.length} users: ${payload.event}`);
        } else if (payload.userId) {
            const userRoom = `user_${payload.userId}`;
            req.io.to(userRoom).emit(payload.event, payload);
            console.log(`Private Socket.IO event sent to ${userRoom}: ${payload.event}`);
        } else {
            req.io.emit(payload.event, payload);
            console.log(`Broadcast Socket.IO event sent: ${payload.event}`);
        }

        return res.status(200).json({ message: 'Evento notificato con successo in broadcast.' });
    } catch (error) {
        console.error(`Error handling webhook: ${error.message}`);
        return res.status(500).json({ message: 'Errore interno del server' });
    }
};

module.exports = {
    handleWebhookNotify
};
