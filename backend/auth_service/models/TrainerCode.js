const mongoose = require('mongoose');

const TrainerCodeSchema = new mongoose.Schema({
  code: {
    type: String,
    required: [true, 'Il codice è obbligatorio'],
    unique: true,
    trim: true
  },
  isUsed: {
    type: Boolean,
    default: false
  },
  usedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  usedAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('TrainerCode', TrainerCodeSchema);
