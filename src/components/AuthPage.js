'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';

export default function AuthPage() {
  const [tab, setTab] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, signUp, isDemoMode } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (tab === 'login') {
        const { error } = await signIn(email, password);
        if (error) setError(error.message);
      } else {
        if (!username.trim()) { setError('Username is required'); setLoading(false); return; }
        const { error } = await signUp(email, password, username);
        if (error) setError(error.message);
      }
    } catch (err) {
      setError('Something went wrong. Try again!');
    }
    setLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-header-box">
        <h1>🌐 MySpacerR</h1>
        <p>a space for friends</p>
      </div>

      {isDemoMode && <div className="demo-notice">🎮 Demo Mode — No database configured. All data is in-memory!</div>}

      <div className="auth-tabs">
        <button className={`auth-tab ${tab === 'login' ? 'active' : ''}`} onClick={() => { setTab('login'); setError(''); }}>Log In</button>
        <button className={`auth-tab ${tab === 'signup' ? 'active' : ''}`} onClick={() => { setTab('signup'); setError(''); }}>Sign Up</button>
      </div>

      <form className="auth-form" onSubmit={handleSubmit}>
        {error && <div className="auth-error">⚠ {error}</div>}
        {tab === 'signup' && (
          <div className="form-group">
            <label className="form-label">Username</label>
            <input className="form-input" type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="Choose a username" required />
          </div>
        )}
        <div className="form-group">
          <label className="form-label">Email</label>
          <input className="form-input" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required />
        </div>
        <div className="form-group">
          <label className="form-label">Password</label>
          <input className="form-input" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required={!isDemoMode} />
        </div>
        <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
          {loading ? 'Loading...' : tab === 'login' ? 'Log In' : 'Sign Up'}
        </button>

        {isDemoMode && tab === 'login' && (
          <p style={{ marginTop: 12, textAlign: 'center', fontSize: 11, color: 'var(--text-muted)' }}>
            Demo account: <strong>tom@myspacer.com</strong> (any password) — or Sign Up!
          </p>
        )}
      </form>
    </div>
  );
}
