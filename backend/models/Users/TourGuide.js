const mongoose = require('mongoose');

const User = require('./User');

const TourGuideProfileSchema = new mongoose.Schema({
    mobileNumber: {type: String, default: null},
    yearsOfExperience: {type: Number, default: 0},
    photoUrl: {type: String, default: null},
    idCardUrl: {type: String, default: null},
    certificates: [{type: String, default: null}],
    isActive: {type: Boolean, default: true},
    previousWorks: [
        {
            jobTitle: {type: String, default: null},
            jobDescription: {type: String, default: null},
            timeLine: [
                {
                    startTime: {type: Date},
                    endTime: {type: Date, default: Date.now},
                }
            ]
        }
    ],
    ratings: [{
        createdBy: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
        rating: {type: Number} ,
        createdAt: {type: Date, default: Date.now}
    }],
    comments: [{
        createdBy: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
        comment: {type: String},
        createdAt: {type: Date, default: Date.now}
    }],
    isAccepted: {type: String, enum: ['Pending', 'Accepted', 'Rejected'], default: 'Pending'},
    isTermsAndConditionsAccepted: {type: Boolean, default: false}
}, {timestamps: true});

const TourGuide = User.discriminator('TourGuide', TourGuideProfileSchema);

module.exports = TourGuide;