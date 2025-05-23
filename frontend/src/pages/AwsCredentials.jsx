import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AwsCredentials() {
  const navigate = useNavigate();
  const [accessKey, setAccessKey] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const [error, setError] = useState('');

  const handleVerify = () => {
    if (!accessKey || !secretKey) {
      setError('Both Access Key and Secret Key are required.');
      return;
    }
    setError('');
    localStorage.setItem('aws_access_key', accessKey);
    localStorage.setItem('aws_secret_key', secretKey);
    navigate('/idle-resources');
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.form}>
        <h2 style={styles.title}>Verify AWS Credentials</h2>

        <input
          type="text"
          placeholder="AWS Access Key"
          autoComplete="off"
          value={accessKey}
          onChange={(e) => setAccessKey(e.target.value)}
          style={styles.input}
        />

        <input
          type="password"
          placeholder="AWS Secret Key"
          autoComplete="new-password"
          value={secretKey}
          onChange={(e) => setSecretKey(e.target.value)}
          style={styles.input}
        />

        {error && <p style={styles.error}>{error}</p>}

        <button onClick={handleVerify} style={styles.button}>
          Confirm
        </button>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    height: '100vh',
    width: '100vw',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: 'linear-gradient(to right, #667eea, #764ba2)',
    fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
  },
  form: {
    width: '100%',
    maxWidth: '400px',
    padding: '2rem',
    borderRadius: '12px',
    textAlign: 'center',
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(8px)',
    boxShadow: '0 8px 30px rgba(0,0,0,0.2)',
  },
  title: {
    fontSize: '1.5rem',
    marginBottom: '1.5rem',
    fontWeight: '600',
    color: '#fff',
  },
  input: {
    width: '100%',
    padding: '0.8rem',
    margin: '0.6rem 0',
    borderRadius: '8px',
    border: '1px solid #ccc',
    fontSize: '1rem',
    backgroundColor: '#f9f9f9',
    color: '#333',
  },
  button: {
    marginTop: '1rem',
    width: '100%',
    padding: '0.9rem',
    fontSize: '1rem',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#4f46e5',
    color: '#fff',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background 0.3s ease',
  },
  error: {
    color: '#ffe0e0',
    background: '#ff4d4f',
    padding: '0.4rem 0.8rem',
    borderRadius: '6px',
    marginTop: '0.5rem',
    fontSize: '0.9rem',
  },
};
