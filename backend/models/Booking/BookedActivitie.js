const mongoose = require('mongoose');

const bookedActivitySchema = new mongoose.Schema({
    activity: { type: mongoose.Schema.Types.ObjectId, ref: 'Activity' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: {
        type: String,
        enum: ['Pending', 'Completed', 'Cancelled'],
        default: 'Pending'
    },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('BookedActivity', bookedActivitySchema);