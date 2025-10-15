const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');

// Defines the POST /api/ai/explain endpoint
router.post('/explain', aiController.explainText);

module.exports = router;
