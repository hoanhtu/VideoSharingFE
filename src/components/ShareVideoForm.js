import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/ShareVideoForm.css';

const API_BASE_URL = 'http://localhost:8080/api';

function ShareVideoForm() {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = sessionStorage.getItem('token');
      const uid = sessionStorage.getItem('uid');

      const response = await fetch(`${API_BASE_URL}/videos/share`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, url, uid }),
      });

      if (!response.ok) {
        throw new Error('Failed to share video');
      }

      // Redirect back to the video list after successful submission
      navigate('/videos');
    } catch (error) {
      console.error('Error sharing video:', error);
      // Handle error (e.g., show error message to user)
    }
  };

  return (
    <div className="share-video-container">
      <form onSubmit={handleSubmit} className="share-video-form">
        <h2>Share a Youtube movie</h2>
        <div className="form-group">
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="url">Youtube URL:</label>
          <input
            type="url"
            id="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="share-button">Share</button>
      </form>
    </div>
  );
}

export default ShareVideoForm;