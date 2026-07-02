const Message = require('../models/Message');

const getChatHistory = (req, res) => {
    const { courseId } = req.params;

    if (!courseId) {
        return res.status(400).json({ success: false, message: 'courseId è obbligatorio' });
    }

    Message.find({ courseId })
        .sort({ timestamp: -1 })
        .limit(50)
        .lean()
        .then(messages => {
            messages.reverse();

            return res.status(200).json({
                success: true,
                data: messages
            });
        })
        .catch(error => {
            console.error(`Error retrieving chat history for course ${req.params.courseId}:`, error.message);
            return res.status(500).json({
                success: false,
                message: 'Errore interno nel recupero della cronologia chat'
            });
        });
};

module.exports = {
    getChatHistory
};
