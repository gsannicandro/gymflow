const TrainerCode = require('../models/TrainerCode');
const User = require('../models/User');

// Helper per generare un codice casuale di 8 caratteri
const generateRandomCode = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// Ottiene tutti i codici trainer
exports.getTrainerCodes = (req, res) => {
  TrainerCode.find()
    .populate('usedBy', 'firstName lastName email')
    .sort({ createdAt: -1 })
    .then(codes => {
      res.status(200).json({
        success: true,
        codes
      });
    })
    .catch(error => {
      res.status(500).json({
        success: false,
        message: 'Errore durante il recupero dei codici trainer',
        error: error.message
      });
    });
};

// Genera un nuovo codice trainer monouso
exports.createTrainerCode = (req, res) => {
  const newCode = new TrainerCode({
    code: generateRandomCode()
  });

  newCode.save()
    .then(savedCode => {
      res.status(201).json({
        success: true,
        message: 'Codice trainer generato con successo',
        code: savedCode
      });
    })
    .catch(error => {
      const isCollision = error.code === 11000;
      res.status(isCollision ? 409 : 500).json({
        success: false,
        message: isCollision
          ? 'Collisione durante la generazione del codice. Riprova.'
          : 'Errore durante la generazione del codice trainer',
        error: error.message
      });
    });
};

// Elimina un codice trainer non utilizzato
exports.deleteTrainerCode = (req, res) => {
  const id = req.params.id;

  TrainerCode.findById(id)
    .then(trainerCode => {
      if (!trainerCode) {
        return res.status(404).json({
          success: false,
          message: 'Codice non trovato'
        });
      }

      if (trainerCode.isUsed) {
        return res.status(400).json({
          success: false,
          message: 'Impossibile eliminare un codice già utilizzato da un trainer'
        });
      }

      return TrainerCode.findByIdAndDelete(id)
        .then(() => {
          res.status(200).json({
            success: true,
            message: 'Codice trainer eliminato con successo'
          });
        });
    })
    .catch(error => {
      res.status(500).json({
        success: false,
        message: 'Errore durante l\'eliminazione del codice trainer',
        error: error.message
      });
    });
};

// Ottiene tutti gli utenti registrati
exports.getUsers = (req, res) => {
  User.find()
    .select('-password')
    .sort({ createdAt: -1 })
    .then(users => {
      res.status(200).json({
        success: true,
        users
      });
    })
    .catch(error => {
      res.status(500).json({
        success: false,
        message: 'Errore durante il recupero degli utenti',
        error: error.message
      });
    });
};

// Disattiva (elimina logicamente) un utente dal sistema
exports.deleteUser = (req, res) => {
  const id = req.params.id;

  if (req.user.id === id) {
    return res.status(400).json({
      success: false,
      message: 'Operazione non consentita: non puoi eliminare il tuo stesso account owner'
    });
  }

  User.findById(id)
    .then(userToDel => {
      if (!userToDel) {
        return res.status(404).json({
          success: false,
          message: 'Utente non trovato'
        });
      }
      if (userToDel.role === 'owner') {
        return res.status(400).json({
          success: false,
          message: 'Non puoi eliminare un altro account owner'
        });
      }

      userToDel.isActive = false;
      return userToDel.save().then(() => {
        res.status(200).json({
          success: true,
          message: 'Utente eliminato con successo dal sistema'
        });
      });
    })
    .catch(error => {
      res.status(500).json({
        success: false,
        message: 'Errore durante l\'eliminazione dell\'utente',
        error: error.message
      });
    });
};


