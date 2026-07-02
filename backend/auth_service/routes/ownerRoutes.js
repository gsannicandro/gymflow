const express = require('express');
const router = express.Router();
const ownerController = require('../controllers/ownerController');
const { protect, verifyOwner } = require('../middlewares/authMiddleware');

// Protegge tutte le rotte seguenti limitandole all'utente autenticato con ruolo owner
router.use(protect);
router.use(verifyOwner);

// Rotte per la gestione dei codici trainer
router.get('/codes', ownerController.getTrainerCodes);
router.post('/codes', ownerController.createTrainerCode);
router.delete('/codes/:id', ownerController.deleteTrainerCode);

// Rotte per la gestione degli utenti
router.get('/users', ownerController.getUsers);
router.delete('/users/:id', ownerController.deleteUser);


module.exports = router;
