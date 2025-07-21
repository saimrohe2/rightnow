const express = require('express');
const router = express.Router();
const queryController = require('../controllers/queryController');

// Defines the POST /api/query endpoint
router.post('/query', queryController.findScenario);

module.exports = router;