const User = require('../models/User');
const SavedRight = require('../models/SavedRight');
// Make sure you import your Scenario model if you need it elsewhere
// const Scenario = require('../models/Scenario'); 

// This function upgrades a user to premium
exports.upgradeUserToPremium = async (req, res) => {
  try {
    const updatedUser = await User.findOneAndUpdate(
      { email: req.user.email },
      { subscriptionStatus: 'premium' },
      { new: true, upsert: true }
    );
    if (!updatedUser) {
      return res.status(404).json({ message: 'Could not find or create user in our database.' });
    }
    res.status(200).json({ message: 'User successfully upgraded to premium.', user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: 'Server error during upgrade.', error: error.message });
  }
};

// This function gets the current user's subscription status
exports.getUserStatus = async (req, res) => {
    try {
      const user = await User.findOne({ email: req.user.email });
      if (!user) {
        return res.status(200).json({ subscriptionStatus: 'free' });
      }
      res.status(200).json({ subscriptionStatus: user.subscriptionStatus });
    } catch (error) {
      res.status(500).json({ message: 'Server error getting user status.', error: error.message });
    }
};

// *** This is the CORRECT function for saving a right ***
exports.saveRight = async (req, res) => {
  try {
    const { scenarioId } = req.body;
    // req.user.uid is populated by your checkAuth middleware
    const userId = req.user.uid; 

    if (!scenarioId) {
        return res.status(400).json({ message: 'Scenario ID is required.' });
    }

    // Check if the right is already saved
    const existing = await SavedRight.findOne({ userId, scenarioId });
    if (existing) {
      return res.status(400).json({ message: 'You have already saved this right.' });
    }

    const newSavedRight = new SavedRight({ userId, scenarioId });
    await newSavedRight.save();

    res.status(201).json({ message: 'Right saved successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error while saving right.', error: error.message });
  }
};

// *** This is the CORRECT function for getting all rights saved by a user ***
exports.getSavedRights = async (req, res) => {
  try {
    const userId = req.user.uid;
    // Find all saved rights and "populate" them with the full scenario data
    const savedRights = await SavedRight.find({ userId }).populate('scenarioId').sort({ savedAt: -1 });
    res.status(200).json(savedRights);
  } catch (error) {
    res.status(500).json({ message: 'Server error while fetching saved rights.', error: error.message });
  }
};