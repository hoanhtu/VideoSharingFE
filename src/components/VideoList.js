import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import VideoItem from './VideoItem';

import '../styles/VideoList.css';

const API_BASE_URL = 'http://localhost:8080/api'; // Replace with your actual API base URL

function VideoList({ onLogout }) {
  const [videos, setVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState({ id: null, username: '' }); // User info state
  const navigate = useNavigate();

  useEffect(() => {
    fetchVideos();
    fetchUserInfo(); // Fetch user info on component mount
  }, []);

  const fetchVideos = async () => {
    try {
      setIsLoading(true);
      const token = sessionStorage.getItem('token');
      const uid = sessionStorage.getItem('uid');
      const username = sessionStorage.getItem('username');

      console.log('Token:', token); // Log the token
      console.log('UID:', uid); // Log the uid

      if (!token || !uid) {
        throw new Error('Authentication information not found');
      }

      console.log('Sending request to:', `${API_BASE_URL}/videos/list`);

      const response = await fetch(`${API_BASE_URL}/videos/list`, {
        method: 'POST', // or 'GET' if your API expects a GET request
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ uid: uid }), // Send uid in the request body
        credentials: 'include', // This line is important for CORS
        mode: 'cors' // This ensures the request is always treated as a CORS request
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      if (!response.ok) {
        if (response.status === 401) {
          // Unauthorized, redirect to login
          sessionStorage.removeItem('token');
          sessionStorage.removeItem('uid');
          navigate('/auth');
          return;
        }
        const errorText = await response.text();
        console.error('Server response:', errorText); // Log the error response
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Received data:', data);
      setVideos(data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching videos:', error);
      setError(error.message || 'Failed to load videos. Please try again later.');
      setIsLoading(false);
    }
  };

  const fetchUserInfo = async () => {   
      setUser({ id: sessionStorage.getItem('uid'), username: sessionStorage.getItem('username') }); // Set user info
  };

  const handleLogout = () => {
    onLogout();
  };

  const handleShareVideo = () => {
    navigate('/share-video');
  };

  if (isLoading) {
    return <div>Loading videos...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="video-list-container">
      <div className="video-list-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Removed inline styles for clarity */}
        <div className="user-info">
          <p>User ID: {user.id}</p>
          <p>Username: {user.username}</p>
        </div>
  
        <div style={{ display: 'flex', gap: '10px' }}> {/* Added flex container for buttons */}
          <button onClick={handleShareVideo} className="share-video-button">Share a Video</button>
          <button onClick={onLogout} className="logout-button">Logout</button> 
        </div>
      </div>
  
      <div className="video-grid">
        {videos.map((video) => (
          <VideoItem key={video.id} video={video} />
        ))}
      </div>
    </div>
  );
}

export default VideoList;