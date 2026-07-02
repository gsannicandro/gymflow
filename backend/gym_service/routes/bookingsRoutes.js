const express = require('express');
const router = express.Router();
const machineController = require('../controllers/machineController');
const { protect } = require('../middlewares/authMiddleware');

// Effettua la prenotazione di un macchinario
router.post('/', protect, machineController.bookMachine);

// Annulla la prenotazione di un macchinario
router.patch('/:id', protect, machineController.cancelBooking);

module.exports = router;
