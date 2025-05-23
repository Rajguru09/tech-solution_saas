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
    <div style={styles.container}>
      <h2 style={styles.heading}>Verify AWS Credentials</h2>
      <form autoComplete="off">
        <input
          type="text"
          placeholder="AWS Access Key"
          name="aws-access-key"
          autoComplete="off"
          value={accessKey}
          onChange={(e) => setAccessKey(e.target.value)}
          style={styles.input}
        />
        <input
          type="password"
          placeholder="AWS Secret Key"
          name="aws-secret-key"
          autoComplete="new-password"
          value={secretKey}
          onChange={(e) => setSecretKey(e.target.value)}
          style={styles.input}
        />
      </form>
      {error && <p style={styles.error}>{error}</p>}
      <button style={styles.button} onClick={handleVerify}>
        Confirm
      </button>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '400px',
    margin: 'auto',
    padding: '2rem',
    backgroundColor: '#1e1e1e',
    borderRadius: '12px',
    color: '#eee',
    fontFamily: 'system-ui, Avenir, Helvetica, Arial, sans-serif',
    textAlign: 'center',
  },
  heading: {
    marginBottom: '1rem',
  },
  input: {
    width: '100%',
    padding: '0.75em',
    margin: '0.5rem 0',
    borderRadius: '8px',
    border: '1px solid #ccc',
    backgroundColor: '#333',
    color: '#fff',
  },
  button: {
    padding: '0.75em 1.5em',
    marginTop: '1rem',
    fontSize: '1em',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#646cff',
    color: '#fff',
    cursor: 'pointer',
  },
  error: {
    color: '#ff4d4f',
    marginTop: '0.5rem',
    fontSize: '0.875em',
  },
};
