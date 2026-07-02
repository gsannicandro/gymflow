const mongoose = require('mongoose');

const MachineSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true
  },
  image_url: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: [true, 'Machine name is required'],
    trim: true
  },
  type: {
    type: String,
    required: [true, 'Machine type is required']
  },
  status: {
    type: String,
    enum: ['available', 'in use'],
    default: 'available'
  },
  activeUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  queue: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Machine', MachineSchema);
