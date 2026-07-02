const mongoose = require('mongoose');

const equipmentStateSchema = new mongoose.Schema({
    machineId: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    gymId: {
        type: String,
        required: true,
        index: true
    },
    status: {
        type: String,
        enum: ['FREE', 'OCCUPIED', 'MAINTENANCE'],
        required: true,
        default: 'FREE'
    },
    lastUpdated: {
        type: Date,
        default: Date.now
    }
});

equipmentStateSchema.pre('save', function(next) {
    this.lastUpdated = Date.now();
    next();
});

const EquipmentState = mongoose.model('EquipmentState', equipmentStateSchema);

module.exports = EquipmentState;
