const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const connectDB = require('./config/db');

connectDB();

const liveRoutes = require('./routes/liveRoutes');
const { handleSocketConnection } = require('./controllers/socketController');

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// Middleware per passare l'istanza io alle routes
app.use((req, res, next) => {
    req.io = io;
    next();
});

io.on('connection', handleSocketConnection);

app.use('/internal', liveRoutes);

const PORT = process.env.PORT || 3004;

server.listen(PORT, () => {
    console.log(`Live Service listening on port ${PORT}`);
});
