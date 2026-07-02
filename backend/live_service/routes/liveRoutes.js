const express = require('express');
const router = express.Router();

const { requireInternalKey, requireAuth } = require('../middlewares/authMiddleware');
const { handleWebhookNotify } = require('../controllers/webhookController');
const { getChatHistory } = require('../controllers/chatController');

// Endpoint: POST /internal/webhook/notify
// Permesso: Chiave Interna
router.post('/webhook/notify', requireInternalKey, handleWebhookNotify);

// Endpoint: GET /chat/:courseId/messages
// Permesso: Utenti autenticati
router.get('/chat/:courseId/messages', requireAuth, getChatHistory);

module.exports = router;
