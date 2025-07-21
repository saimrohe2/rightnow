const mongoose = require('mongoose');

const savedRightSchema = new mongoose.Schema({
  // The ID of the user who saved the right (from Firebase)
  userId: {
    type: String,
    required: true,
  },
  // The ID of the scenario document that was saved
  scenarioId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Scenario', // This creates a link to your 'Scenario' model
    required: true,
  },
  savedAt: {
    type: Date,
    default: Date.now,
  },
});

// This prevents a user from saving the same right multiple times
savedRightSchema.index({ userId: 1, scenarioId: 1 }, { unique: true });

module.exports = mongoose.model('SavedRight', savedRightSchema);