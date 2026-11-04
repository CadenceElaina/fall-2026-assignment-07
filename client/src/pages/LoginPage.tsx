import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

type Mode = 'login' | 'signup';

export default function LoginPage() {
  const [mode, setMode] = useState<Mode>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { login, signup } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      if (mode === 'signup') {
        await signup(username, password);
        // After signing up, log the user in automatically
        await login(username, password);
      } else {
        await login(username, password);
      }
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="page" style={{ maxWidth: '400px', margin: '4rem auto' }}>
      <h1>{mode === 'login' ? 'Log In' : 'Sign Up'}</h1>

      {error && <p className="error">{error}</p>}

      <form onSubmit={handleSubmit} className="article-form">
        <label>
          Username
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            required
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            required
          />
        </label>
        <div className="form-actions">
          <button type="submit" disabled={submitting}>
            {submitting
              ? mode === 'login'
                ? 'Logging in…'
                : 'Creating account…'
              : mode === 'login'
                ? 'Log In'
                : 'Sign Up'}
          </button>
        </div>
      </form>

      <p style={{ marginTop: '1rem', textAlign: 'center' }}>
        {mode === 'login' ? (
          <>
            No account?{' '}
            <button
              className="link-button"
              onClick={() => { setMode('signup'); setError(''); }}
            >
              Sign up
            </button>
          </>
        ) : (
          <>
            Already have an account?{' '}
            <button
              className="link-button"
              onClick={() => { setMode('login'); setError(''); }}
            >
              Log in
            </button>
          </>
        )}
      </p>
    </div>
  );
}
