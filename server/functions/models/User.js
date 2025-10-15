const mongoose = require('mongoose');

// Define the schema for a single saved right
const SavedRightSchema = new mongoose.Schema({
    query: {
        type: String,
        required: true,
        trim: true
    },
    resultText: {
        type: String,
        required: true
    },
    savedAt: {
        type: Date,
        default: Date.now
    }
});

// A single, combined schema for the user
const UserSchema = new mongoose.Schema({
    firebaseUid: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    subscriptionStatus: {
        type: String,
        enum: ['free', 'premium'],
        default: 'free',
    },
    savedRights: [SavedRightSchema]
});

module.exports = mongoose.model('User', UserSchema);