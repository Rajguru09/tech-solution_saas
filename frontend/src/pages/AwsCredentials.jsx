//cat AwsCredentials.jsx##
import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function AwsCredentials() {
  const navigate = useNavigate();

  const handleVerify = () => {
    // Simulate successful verification
    navigate('/idle-resources');
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Verify AWS Credentials</h2>
      <input type="text" placeholder="Access Key ID" style={styles.input} />
      <input type="password" placeholder="Secret Access Key" style={styles.input} />
      <input type="text" placeholder="Region" style={styles.input} />
      <button style={styles.button} onClick={handleVerify}>
        Verify and Continue
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
};
