import { useState, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createArticle } from '../api/articles';

export default function NewArticlePage() {
  const [title, setTitle] = useState('');
  const [contents, setContents] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const article = await createArticle({ title, contents });
      navigate(`/articles/${article.articleId}`);
    } catch {
      setError('Failed to create article. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="page">
      <Link to="/" className="back-link">← Back to list</Link>
      <h1>New Article</h1>

      {error && <p className="error">{error}</p>}

      <form onSubmit={handleSubmit} className="article-form">
        <label>
          Title
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </label>
        <label>
          Contents
          <textarea
            value={contents}
            onChange={(e) => setContents(e.target.value)}
            rows={8}
            required
          />
        </label>
        <div className="form-actions">
          <button type="submit" disabled={submitting}>
            {submitting ? 'Creating…' : 'Create Article'}
          </button>
          <Link to="/">Cancel</Link>
        </div>
      </form>
    </div>
  );
}
