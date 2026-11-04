import { getToken } from './auth';

const BASE = '/api';

export type Article = {
  articleId: number;
  title: string;
  contents: string;
};

// ── Auth helper ──────────────────────────────────────────────────────────────

function authHeaders(): HeadersInit {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// ── API calls ────────────────────────────────────────────────────────────────

export async function getArticles(titleContains?: string): Promise<Article[]> {
  const params = titleContains
    ? `?title_contains=${encodeURIComponent(titleContains)}`
    : '';
  const res = await fetch(`${BASE}/articles${params}`, {
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error('Failed to fetch articles');
  return res.json();
}

export async function getArticle(id: number): Promise<Article> {
  const res = await fetch(`${BASE}/articles/${id}`, {
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error('Article not found');
  return res.json();
}

export async function createArticle(data: {
  title: string;
  contents: string;
}): Promise<Article> {
  const res = await fetch(`${BASE}/articles`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create article');
  return res.json();
}
