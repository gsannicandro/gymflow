const express = require('express');
const router = express.Router();
const machineController = require('../controllers/machineController');
const { protect } = require('../middlewares/authMiddleware');

// Recupera tutti i macchinari e il loro stato
router.get('/', protect, machineController.getAllMachines);



// Avvia una sessione di utilizzo su un macchinario
router.post('/:id/session', protect, machineController.useMachine);

// Termina la sessione di utilizzo su un macchinario
router.delete('/:id/session', protect, machineController.releaseMachine);

// Si inserisce nella coda di un macchinario
router.post('/:id/queue', protect, machineController.joinQueue);

// Abbandona la coda di un macchinario
router.delete('/:id/queue', protect, machineController.leaveQueue);

module.exports = router;