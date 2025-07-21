document.addEventListener('DOMContentLoaded', () => {
  const articlesContainer = document.getElementById('articles-container');
  const articleContent = document.getElementById('article-content');
  const API_BASE_URL = 'http://localhost:5000/api/articles';

  // Check if we are on the main blog page or a single article page
  if (articlesContainer) {
    // We are on the main blog page (blog.html)
    fetchAllArticles();
  } else if (articleContent) {
    // We are on a single article page (article.html)
    fetchSingleArticle();
  }

  async function fetchAllArticles() {
    try {
      const response = await fetch(API_BASE_URL);
      const articles = await response.json();
      articlesContainer.innerHTML = ''; // Clear loading state
      articles.forEach(article => {
        const articleCard = document.createElement('a');
        articleCard.href = `article.html?slug=${article.slug}`;
        articleCard.className = 'article-card';
        articleCard.innerHTML = `
          <img src="${article.imageUrl}" alt="${article.title}">
          <div class="article-card-content">
            <h2>${article.title}</h2>
            <p>${article.summary}</p>
          </div>
        `;
        articlesContainer.appendChild(articleCard);
      });
    } catch (error) {
      articlesContainer.innerHTML = '<p>Could not load articles.</p>';
      console.error('Error fetching articles:', error);
    }
  }

  async function fetchSingleArticle() {
    try {
      // Get the 'slug' from the URL (e.g., article.html?slug=my-first-post)
      const urlParams = new URLSearchParams(window.location.search);
      const slug = urlParams.get('slug');

      if (!slug) {
        articleContent.innerHTML = '<h1>Article not found.</h1>';
        return;
      }

      const response = await fetch(`${API_BASE_URL}/${slug}`);
      const article = await response.json();
      
      document.title = `${article.title} - RightNow`; // Update page title
      articleContent.innerHTML = `
        <img src="${article.imageUrl}" alt="${article.title}">
        <h1>${article.title}</h1>
        <p><em>By ${article.author} on ${new Date(article.createdAt).toLocaleDateString()}</em></p>
        <hr style="margin: 1rem 0; border-color: rgba(255,255,255,0.1);">
        <div>${article.content}</div>
      `;
    } catch (error) {
      articleContent.innerHTML = '<h1>Could not load article.</h1>';
      console.error('Error fetching single article:', error);
    }
  }
});
