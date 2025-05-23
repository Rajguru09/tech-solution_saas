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
      <div style={styles.card}>
        <h2 style={styles.title}>Verify AWS Credentials</h2>

        <input
          type="text"
          name="aws-access-key"
          placeholder="AWS Access Key"
          autoComplete="off"
          value={accessKey}
          onChange={(e) => setAccessKey(e.target.value)}
          style={styles.input}
        />

        <input
          type="password"
          name="aws-secret-key"
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
    display: 'flex',
    height: '100vh',
    justifyContent: 'center',
    alignItems: 'center',
    background: 'linear-gradient(to right, #0f2027, #203a43, #2c5364)',
    fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
  },
  card: {
    backgroundColor: '#1e1e1e',
    padding: '2.5rem',
    borderRadius: '16px',
    width: '100%',
    maxWidth: '420px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
    textAlign: 'center',
    color: '#fff',
  },
  title: {
    fontSize: '1.5rem',
    marginBottom: '1.5rem',
    fontWeight: '600',
  },
  input: {
    width: '100%',
    padding: '0.85rem',
    margin: '0.6rem 0',
    borderRadius: '10px',
    border: '1px solid #555',
    backgroundColor: '#2a2a2a',
    color: '#fff',
    fontSize: '1rem',
    transition: 'border 0.3s ease',
    outline: 'none',
  },
  button: {
    marginTop: '1rem',
    padding: '0.9rem 1.5rem',
    width: '100%',
    fontSize: '1rem',
    borderRadius: '10px',
    border: 'none',
    backgroundColor: '#4f46e5',
    color: '#fff',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background 0.3s ease',
  },
  error: {
    color: '#ff4d4f',
    fontSize: '0.9rem',
    marginTop: '0.5rem',
    animation: 'fadeIn 0.3s ease-in-out',
  },
};
