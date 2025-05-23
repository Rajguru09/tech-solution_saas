import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();

  const handleIdleResourcesClick = () => {
    // Navigate to AWS credentials verification first
    navigate('/aws-credentials');
  };

  const handleAuditingClick = () => {
    // Navigate directly to Accountability Auditing (you can also add a credentials step here if needed)
    navigate('/accountability-auditing');
  };

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Welcome to CleanCloud</h1>
      <div style={styles.buttonGroup}>
        <button style={styles.button} onClick={handleIdleResourcesClick}>
          Idle Resources
        </button>
        <button style={styles.button} onClick={handleAuditingClick}>
          Accountability Auditing
        </button>
      </div>
      <button style={styles.logoutButton} onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '600px',
    margin: 'auto',
    padding: '3rem',
    textAlign: 'center',
    fontFamily: 'system-ui, Avenir, Helvetica, Arial, sans-serif',
    backgroundColor: '#1e1e1e',
    borderRadius: '16px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
    color: '#eee',
  },
  title: {
    marginBottom: '2rem',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  buttonGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    marginBottom: '2rem',
  },
  button: {
    padding: '0.75em 1.5em',
    fontSize: '1.1em',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    backgroundColor: '#646cff',
    color: '#fff',
    transition: 'background-color 0.3s ease',
  },
  logoutButton: {
    padding: '0.6em 1.2em',
    fontSize: '1em',
    borderRadius: '8px',
    border: '1px solid #646cff',
    backgroundColor: 'transparent',
    color: '#646cff',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease, color 0.3s ease',
  },
};

