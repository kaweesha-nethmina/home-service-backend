const mongoose = require('mongoose');

const WorkSchema = new mongoose.Schema({
    provider: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: { type: String, required: true },
    description: String,
    images: [String],
    date: { type: Date, default: Date.now },
    service: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service'
    },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Work', WorkSchema);
