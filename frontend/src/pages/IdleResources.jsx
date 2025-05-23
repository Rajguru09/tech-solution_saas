// src/pages/IdleResources.jsx
import React from 'react';
import IdleResourcesDashboard from '../components/IdleResourcesDashboard';
import { useNavigate } from 'react-router-dom';

export default function IdleResources() {
  const navigate = useNavigate();

  const access_key = localStorage.getItem('aws_access_key');
  const secret_key = localStorage.getItem('aws_secret_key');

  if (!access_key || !secret_key) {
    // If no credentials, redirect to AwsCredentials page or show message
    navigate('/');
    return null; // or a loading spinner/message
  }

  return (
    <IdleResourcesDashboard
      awsCredentials={{ access_key, secret_key }}
      onLogout={() => {
        localStorage.removeItem('aws_access_key');
        localStorage.removeItem('aws_secret_key');
        navigate('/');
      }}
    />
  );
}
