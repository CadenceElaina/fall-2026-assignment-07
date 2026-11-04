import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getArticles, type Article } from '../api/articles';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

export default function ArticleListPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { logout } = useAuth();

  useEffect(() => {
    getArticles(search || undefined)
      .then(setArticles)
      .catch(() => setError('Could not load articles.'));
  }, [search]);

  return (
    <div className="page">
      <div className="page-header">
        <h1>Articles</h1>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle dark mode">
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
          <button onClick={() => navigate('/articles/new')}>+ New Article</button>
          <button onClick={() => { logout(); navigate('/login'); }}>Log Out</button>
        </div>
      </div>

      <input
        className="search"
        type="search"
        placeholder="Search by title…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {error && <p className="error">{error}</p>}

      {articles.length === 0 && !error ? (
        <p className="empty">No articles found.</p>
      ) : (
        <ul className="article-list">
          {articles.map((a) => (
            <li key={a.articleId}>
              <Link to={`/articles/${a.articleId}`}>
                <span className="article-id">#{a.articleId}</span>
                <span className="article-title">{a.title}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
