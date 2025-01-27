const mongoose = require('mongoose');

const bookedItinerarySchema = new mongoose.Schema({
    itinerary: { type: mongoose.Schema.Types.ObjectId, ref: 'Itinerary' },
    date: { type: Date, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    price: { type: Number, required: true },
    status: {
        type: String,
        enum: ['Pending', 'Completed', 'Cancelled'],
        default: 'Pending'
    },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });


module.exports = mongoose.model('BookedItinerary', bookedItinerarySchema);