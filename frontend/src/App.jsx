import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import Home from './pages/Home';
import AwsCredentials from './pages/AwsCredentials';
import NotFound from './pages/NotFound';
import IdleResourcesDashboard from './pages/IdleResourcesDashboard';

// Lazy load dashboards for better performance
const IdleResourcesDashboard = lazy(() => import('./pages/IdleResourcesDashboard'));
const AccountabilityAuditing = lazy(() => import('./pages/AccountabilityAuditing')); // add this page

// Auth check: user is authenticated if AWS credentials validated (adjust to your logic)
const isAuthenticated = () => {
  return localStorage.getItem("awsValidated") === "true";
};

// Protected route wrapper component
const ProtectedRoute = ({ element }) => {
  return isAuthenticated() ? element : <Navigate to="/login" replace />;
};

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div className="p-4 text-center">Loading...</div>}>
        <Routes>
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/login" element={<AuthPage initialForm="login" />} />
          <Route path="/signup" element={<AuthPage initialForm="signup" />} />
          <Route path="/home" element={<Home />} />

          {/* AwsCredentials is open to all users to input/validate AWS credentials */}
          <Route path="/aws-credentials" element={<AwsCredentials />} />

          {/* Protect dashboard pages */}
          <Route path="/idle-resources" element={<ProtectedRoute element={<IdleResourcesDashboard />} />} />
          <Route path="/accountability-auditing" element={<ProtectedRoute element={<AccountabilityAuditing />} />} />

          {/* Fallback route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
