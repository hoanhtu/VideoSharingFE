import React, { useState } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api'; // Adjust this to match your server URL

function Header({ user, onAuthSuccess, onLogout }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        username,
        password
      });
      onAuthSuccess(response.data); // Assuming the server returns user data
      setUsername('');
      setPassword('');
    } catch (error) {
      console.error('Login error:', error);
      setError('Invalid username or password');
    }
  };

  return (
    <header className="app-header">
      <h1>Funny Movies</h1>
      {user ? (
        <div className="user-info">
          <span>Welcome, {user.username}</span>
          <button onClick={onLogout}>Logout</button>
        </div>
      ) : (
        <form onSubmit={handleLogin} className="login-form">
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
          <button type="submit">Login / Register</button>
          {error && <p className="error-message">{error}</p>}
        </form>
      )}
    </header>
  );
}

export default Header;