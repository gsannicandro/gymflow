const ActiveWorkout = require('../models/ActiveWorkout');
const Exercise = require('../models/Exercise');

// Genera una scheda di allenamento casuale per l'utente
exports.generateWorkout = (req, res) => {
  const userId = req.user.id;

  ActiveWorkout.findOne({ user: userId, status: 'active' })
    .then(existingWorkout => {
      if (existingWorkout) {
        throw new Error('ACTIVE_WORKOUT_EXISTS');
      }
      return Exercise.aggregate([{ $sample: { size: 10 } }]);
    })
    .then(exercises => {
      // Associa gli esercizi estratti e li imposta come non completati
      const exercisesList = exercises.map(ex => ({
        exercise: ex._id,
        completed: false
      }));
      return ActiveWorkout.create({
        user: userId,
        exercises: exercisesList
      });
    })
    .then(workout => {
      return ActiveWorkout.findById(workout._id).populate('exercises.exercise');
    })
    .then(populatedWorkout => {
      res.status(201).json({
        success: true,
        data: populatedWorkout
      });
    })
    .catch(error => {
      if (error.message === 'ACTIVE_WORKOUT_EXISTS') {
        return res.status(400).json({
          success: false,
          message: 'Hai già un allenamento in corso. Completalo prima di crearne uno nuovo.'
        });
      }
      console.error(`Error generating workout: ${error.message}`);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    });
};

// Recupera gli allenamenti dell'utente (filtra per stato se fornito nella query)
exports.getWorkouts = (req, res) => {
  const { status } = req.query;
  const userId = req.user.id;

  const query = { user: userId };
  if (status) {
    query.status = status;
  }

  ActiveWorkout.find(query)
    .populate('exercises.exercise')
    .sort({ createdAt: -1 })
    .then(workouts => {
      res.status(200).json({
        success: true,
        data: workouts
      });
    })
    .catch(error => {
      console.error(`Error retrieving workouts: ${error.message}`);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    });
};

// Segna un singolo esercizio come completato o non completato
exports.markExerciseComplete = (req, res) => {
  const { workoutId, exerciseId } = req.params;
  const { completed } = req.body;
  const userId = req.user.id;

  if (completed === undefined) {
    return res.status(400).json({
      success: false,
      message: 'Missing completed field in request body'
    });
  }

  ActiveWorkout.findOne({ _id: workoutId, user: userId })
    .then(workout => {
      if (!workout) {
        return res.status(404).json({
          success: false,
          message: 'Workout not found'
        });
      }

      const exerciseIndex = workout.exercises.findIndex(
        ex => ex.exercise.toString() === exerciseId
      );

      if (exerciseIndex === -1) {
        return res.status(404).json({
          success: false,
          message: 'Exercise not found in workout'
        });
      }

      workout.exercises[exerciseIndex].completed = completed;

      // Se tutti gli esercizi sono stati completati, marca la scheda come completata
      const allCompleted = workout.exercises.every(ex => ex.completed);
      if (allCompleted) {
        workout.status = 'completed';
        workout.endDate = Date.now();
      } else {
        workout.status = 'active';
        workout.endDate = undefined;
      }

      return workout.save();
    })
    .then(updatedWorkout => {
      return ActiveWorkout.findById(updatedWorkout._id).populate('exercises.exercise');
    })
    .then(populatedWorkout => {
      res.status(200).json({
        success: true,
        data: populatedWorkout
      });
    })
    .catch(error => {
      console.error(`Error marking exercise complete: ${error.message}`);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    });
};
