import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();

  const handleCardClick = (path) => {
    navigate('/aws-credentials', { state: { nextPath: path } });
  };

  return (
    <div style={styles.wrapper}>
      <h1 style={styles.heading}>Welcome to CleanCloud</h1>
      <div style={styles.cardContainer}>
        <div style={styles.card} onClick={() => handleCardClick('/idle-resources')}>
          <h2 style={styles.cardTitle}> Idle Resources</h2>
          <p style={styles.cardDesc}>Detect and clean up unused AWS resources.</p>
        </div>
        <div style={styles.card} onClick={() => handleCardClick('/accountability-auditing')}>
          <h2 style={styles.cardTitle}> Accountability Auditing</h2>
          <p style={styles.cardDesc}>Audit missing tags, ownership, and team accountability.</p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    height: '100vh',
    width: '100vw',
    background: 'linear-gradient(to right, #6a11cb, #2575fc)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
    color: '#fff',
    textAlign: 'center',
    padding: '2rem',
  },
  heading: {
    fontSize: '2.5rem',
    marginBottom: '2rem',
    fontWeight: '700',
  },
  cardContainer: {
    display: 'flex',
    gap: '2rem',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: '16px',
    padding: '2rem',
    width: '280px',
    cursor: 'pointer',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    boxShadow: '0 8px 30px rgba(0,0,0,0.2)',
  },
  cardTitle: {
    fontSize: '1.4rem',
    marginBottom: '0.5rem',
  },
  cardDesc: {
    fontSize: '1rem',
    color: '#e0e0e0',
  },
};
