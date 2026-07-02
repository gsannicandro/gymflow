const mongoose = require('mongoose');

const ExerciseSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: [true, 'La descrizione è obbligatoria'],
    trim: true
  },
  difficulty: {
    type: String,
    required: [true, 'La difficoltà è obbligatoria']
  },
  machine_id: {
    type: String,
    ref: 'Machine',
    required: true
  },
  movement_type: {
    type: String,
    required: [true, 'Il tipo di movimento è obbligatorio']
  },
  muscle_group: {
    type: String,
    required: [true, 'Il gruppo muscolare è obbligatorio']
  },
  name: {
    type: String,
    required: [true, 'Il nome dell\'esercizio è obbligatorio'],
    trim: true
  },
  reps: {
    type: Number,
    required: [true, 'Il numero di ripetizioni è obbligatorio'],
    min: [1, 'Almeno 1 ripetizione']
  },
  sets: {
    type: Number,
    required: [true, 'Il numero di serie è obbligatorio'],
    min: [1, 'Almeno 1 serie']
  },
  recovery: {
    type: Number,
    default: 60
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Exercise', ExerciseSchema);
