const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    courseId: {
        type: String,
        required: true,
        index: true
    },
    senderId: {
        type: String,
        required: true
    },
    senderName: {
        type: String,
        required: false,
        default: 'Utente'
    },
    content: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now,
        index: true
    }
});

messageSchema.index({ courseId: 1, timestamp: -1 });

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
