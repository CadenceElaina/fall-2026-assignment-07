const BASE = '/api';

// ── localStorage helpers ─────────────────────────────────────────────────────

const JWT_KEY = 'jwt';

export function getToken(): string | null {
  return localStorage.getItem(JWT_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(JWT_KEY, token);
}

export function removeToken(): void {
  localStorage.removeItem(JWT_KEY);
}

// ── API calls ────────────────────────────────────────────────────────────────

export async function signup(username: string, password: string): Promise<void> {
  const res = await fetch(`${BASE}/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) throw new Error('Signup failed');
}

export async function login(username: string, password: string): Promise<string> {
  const res = await fetch(`${BASE}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) throw new Error('Invalid username or password');
  const data = await res.json();
  return data.jwt as string;
}
