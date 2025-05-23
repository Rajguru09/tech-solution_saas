import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SignupForm() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    contact: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
    setSuccess('');
  };

  const handleSubmit = e => {
    e.preventDefault();

    // Basic validation
    if (!form.name || !form.contact || !form.email || !form.password || !form.confirmPassword) {
      setError('Please fill all fields');
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Save user data in localStorage (simulate DB)
    const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const userExists = existingUsers.find(u => u.email === form.email);
    if (userExists) {
      setError('User with this email already exists');
      return;
    }

    existingUsers.push({
      name: form.name,
      contact: form.contact,
      email: form.email,
      password: form.password,
    });
    localStorage.setItem('users', JSON.stringify(existingUsers));

    setSuccess('Signup successful! Redirecting to login...');
    setTimeout(() => {
      navigate('/login');
    }, 2000);
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <h2>Sign Up</h2>

      <input
        type="text"
        name="name"
        placeholder="Name"
        value={form.name}
        onChange={handleChange}
        required
      />
      <input
        type="tel"
        name="contact"
        placeholder="Contact Number"
        value={form.contact}
        onChange={handleChange}
        required
      />
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
      <input
        type="password"
        name="confirmPassword"
        placeholder="Confirm Password"
        value={form.confirmPassword}
        onChange={handleChange}
        required
      />

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}

      <button type="submit">Sign Up</button>
    </form>
  );
}
