const mongoose = require('mongoose');

const WorkSchema = new mongoose.Schema({
    title: String,
    description: String,
    images: [String],
    date: Date,
    service: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const UserSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    role: String, // 'admin', 'provider', 'customer'
    phone: String,
    bio: String,
    skills: [String],
    location: String,
    rating: {
        type: Number,
        default: 0
    },
    works: [WorkSchema],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('User', UserSchema);