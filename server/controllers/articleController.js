const Article = require('../models/Article');

// Get all articles (for the main blog page)
exports.getAllArticles = async (req, res) => {
  try {
    const articles = await Article.find().sort({ createdAt: -1 }); // Sort by newest first
    res.status(200).json(articles);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching articles.', error: error.message });
  }
};

// Get a single article by its slug (for the individual article page)
exports.getArticleBySlug = async (req, res) => {
  try {
    const article = await Article.findOne({ slug: req.params.slug });
    if (!article) {
      return res.status(404).json({ message: 'Article not found.' });
    }
    res.status(200).json(article);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching article.', error: error.message });
  }
};
