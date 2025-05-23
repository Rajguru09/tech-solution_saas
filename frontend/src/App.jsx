import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import Home from './pages/Home';
import AwsCredentials from './pages/AwsCredentials'; // add this page
import IdleResourcesDashboard from './pages/IdleResourcesDashboard';
import NotFound from './pages/NotFound'; // optional 404 component

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} /> {/* Redirect root */}
        <Route path="/login" element={<AuthPage initialForm="login" />} />
        <Route path="/signup" element={<AuthPage initialForm="signup" />} />
        <Route path="/home" element={<Home />} />
        <Route path="/aws-credentials" element={<AWSCredentialsPage />} />
        <Route path="/idle-resources" element={<IdleResourcesDashboard />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
