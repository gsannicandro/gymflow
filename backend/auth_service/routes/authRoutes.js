const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');

// Rotta per registrare un nuovo utente
router.post('/register', authController.register);

// Rotta per effettuare il login
router.post('/login', authController.login);

// Rotta per ottenere il profilo dell'utente loggato
router.get('/profile', protect, authController.getProfile);

// Rotta per aggiornare il profilo dell'utente loggato
router.put('/profile', protect, authController.updateProfile);

// Rotta per cambiare la password
router.put('/password', protect, authController.changePassword);

// Rotta per effettuare il logout (invalidazione refresh token su db)
router.post('/logout', protect, authController.logout);

// Rotta per rinnovare l'access token tramite refresh token
router.post('/refresh', authController.refreshToken);

module.exports = router;
