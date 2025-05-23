import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LoginForm() {
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
    setSuccess('');
  };

  const handleSubmit = e => {
    e.preventDefault();

    if (!form.email || !form.password) {
      setError('Please fill both email and password');
      return;
    }

    // Check credentials against localStorage users
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.email === form.email && u.password === form.password);

    if (!user) {
      setError('Invalid email or password');
      return;
    }

    setSuccess('Login successful! Redirecting to homepage...');
    setTimeout(() => {
      navigate('/home');
    }, 1500);
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <h2>Login</h2>

      <input
        type="email"
        name="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
        required
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        value={form.password}
        onChange={handleChange}
        required
      />

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}

      <button type="submit">Login</button>
    </form>
  );
}
