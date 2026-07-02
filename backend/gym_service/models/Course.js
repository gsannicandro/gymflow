const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Il nome del corso è obbligatorio'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  days: [{
    type: String,
    required: true
  }],
  time: {
    type: String,
    required: [true, 'L\'orario è obbligatorio']
  },
  duration: {
    type: Number,
    required: [true, 'La durata è obbligatoria'],
    min: [1, 'La durata deve essere di almeno 1 minuto']
  },
  maxParticipants: {
    type: Number,
    default: 20,
    min: [1, 'Il numero massimo di partecipanti deve essere almeno 1']
  },
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Course', CourseSchema);
