import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getArticle, type Article } from '../api/articles';

export default function ArticleDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    getArticle(Number(id))
      .then(setArticle)
      .catch(() => setError('Article not found.'));
  }, [id]);

  if (error) {
    return (
      <div className="page">
        <p className="error">{error}</p>
        <Link to="/">← Back to list</Link>
      </div>
    );
  }

  if (!article) {
    return <div className="page">Loading…</div>;
  }

  return (
    <div className="page">
      <Link to="/" className="back-link">← Back to list</Link>
      <h1>{article.title}</h1>
      <p className="article-meta">Article #{article.articleId}</p>
      <div className="article-body">
        <p>{article.contents}</p>
      </div>
    </div>
  );
}
