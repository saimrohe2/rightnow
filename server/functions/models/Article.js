const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true }, // For creating user-friendly URLs
  author: { type: String, default: 'RightNow Team' },
  summary: { type: String, required: true }, // A short summary for the blog list page
  content: { type: String, required: true }, // The full content of the article (can include HTML)
  imageUrl: { type: String, required: true }, // URL for a header image
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Article', articleSchema);
