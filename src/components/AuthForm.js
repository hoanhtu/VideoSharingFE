import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api'; // Replace with your backend API URL

function AuthForm({ onAuthSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    const endpoint = isLogin ? 'login' : 'register';

    try {
      const response = await fetch(`${API_BASE_URL}/auth/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const contentType = response.headers.get("content-type");
      let data;

      if (contentType && contentType.indexOf("application/json") !== -1) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      if (!response.ok) {
        throw new Error(typeof data === 'string' ? data : data.message || 'Authentication failed');
      }

      if (isLogin) {
        onAuthSuccess(data);
        navigate('/videos');
      } else {
        setSuccessMessage(typeof data === 'string' ? data : 'User registered successfully. Please log in.');
        setIsLogin(true);
        setUsername('');
        setPassword('');
      }
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="auth-form">
      <h2>{isLogin ? 'Login' : 'Register'}</h2>
      {error && <p className="error-message">{error}</p>}
      {successMessage && <p className="success-message">{successMessage}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">{isLogin ? 'Login' : 'Register'}</button>
      </form>
      <button onClick={() => {
        setIsLogin(!isLogin);
        setError(null);
        setSuccessMessage(null);
        setUsername('');
        setPassword('');
      }}>
        {isLogin ? 'Need to register?' : 'Already have an account?'}
      </button>
    </div>
  );
}

export default AuthForm;