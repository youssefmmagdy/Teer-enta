const mongoose = require('mongoose');

const AccountDeletionRequestSchema = new mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    createdAt: {type: Date, default: Date.now}
})

module.exports = mongoose.model('AccountDeletionRequest', AccountDeletionRequestSchema);