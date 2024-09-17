import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthForm from './AuthForm';
import VideoList from './VideoList';
import ShareVideoForm from './ShareVideoForm';

function AuthWrapper() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = () => {
    const token = sessionStorage.getItem('token');
    const uid = sessionStorage.getItem('uid');
    if (token && uid) {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  };

  const handleAuthSuccess = (authData) => {
    sessionStorage.setItem('token', authData.token);
    sessionStorage.setItem('uid', authData.uid.toString());
    sessionStorage.setItem('username', authData.username);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('uid');
    sessionStorage.removeItem('username');
    setIsAuthenticated(false);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={isAuthenticated ? <Navigate to="/videos" /> : <Navigate to="/auth" />} />
        <Route 
          path="/auth" 
          element={isAuthenticated ? <Navigate to="/videos" /> : <AuthForm onAuthSuccess={handleAuthSuccess} />} 
        />
        <Route 
          path="/videos" 
          element={isAuthenticated ? <VideoList onLogout={handleLogout} /> : <Navigate to="/auth" />} 
        />
         <Route 
          path="/share-video" 
          element={isAuthenticated ? <ShareVideoForm /> : <Navigate to="/auth" />} 
        />
        
      </Routes>
    </Router>
  );
}

export default AuthWrapper;