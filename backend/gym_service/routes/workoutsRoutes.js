const express = require('express');
const router = express.Router();
const workoutController = require('../controllers/workoutController');
const { protect } = require('../middlewares/authMiddleware');

// Genera un workout
router.post('/', protect, workoutController.generateWorkout);

// Recupera il workout di un utente basato sulla query ?status=active o ?status=completed
router.get('/', protect, workoutController.getWorkouts);

// Aggiorna uno specifico esercizio in un workout (es. contrassegna come completato tramite body)
router.patch('/:workoutId/exercises/:exerciseId', protect, workoutController.markExerciseComplete);

module.exports = router;