import React, { useState } from 'react';
import { login } from '../../services/api';

function Login({ onLogin, onSwitchToRegister }) {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await login(form);
      onLogin(res.data.token, res.data.user);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h2>Sign In</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        <label>Username
          <input name="username" value={form.username} onChange={handleChange} required autoFocus />
        </label>
        <label>Password
          <input name="password" type="password" value={form.password} onChange={handleChange} required />
        </label>
        {error && <p className="error">{error}</p>}
        <button type="submit" disabled={loading}>{loading ? 'Signing in…' : 'Sign In'}</button>
      </form>
      <p className="auth-switch">
        Don't have an account?{' '}
        <button type="button" className="link-btn" onClick={onSwitchToRegister}>Register</button>
      </p>
    </div>
  );
}

export default Login;
