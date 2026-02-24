import React, { useState } from 'react';
import { register } from '../../services/api';

function Register({ onLogin, onSwitchToLogin }) {
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await register(form);
      onLogin(res.data.token, res.data.user);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h2>Create Account</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        <label>Username
          <input name="username" value={form.username} onChange={handleChange} required autoFocus />
        </label>
        <label>Email
          <input name="email" type="email" value={form.email} onChange={handleChange} required />
        </label>
        <label>Password
          <input name="password" type="password" value={form.password} onChange={handleChange} required minLength={6} />
        </label>
        {error && <p className="error">{error}</p>}
        <button type="submit" disabled={loading}>{loading ? 'Registering…' : 'Register'}</button>
      </form>
      <p className="auth-switch">
        Already have an account?{' '}
        <button type="button" className="link-btn" onClick={onSwitchToLogin}>Sign In</button>
      </p>
    </div>
  );
}

export default Register;
