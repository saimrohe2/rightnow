const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const checkAuth = require('../middleware/authMiddleware');

// This file should ONLY define routes.
// It should NOT define any Mongoose schemas or models.

// Route to get a user's subscription status
router.get('/status', checkAuth, userController.getUserStatus);

// Route to save a right for a user
router.post('/save-right', checkAuth, userController.saveRight);

// Route to get all of a user's saved rights
router.get('/saved-rights', checkAuth, userController.getSavedRights);

// Route to upgrade a user to premium (if you still need it)
// router.post('/upgrade', checkAuth, userController.upgradeUserToPremium);

module.exports = router;