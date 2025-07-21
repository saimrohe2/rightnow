const express = require('express');
const router = express.Router();
const articleController = require('../controllers/articleController');

// Route to get all articles
// GET /api/articles
router.get('/', articleController.getAllArticles);

// Route to get a single article by its slug
// GET /api/articles/:slug
router.get('/:slug', articleController.getArticleBySlug);

module.exports = router;
