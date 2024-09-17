import React from 'react';

function VideoItem({ video }) {
  // Function to extract YouTube video ID from URL
  const getYouTubeId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const youtubeId = getYouTubeId(video.url);

  return (
    <div className="video-item">
      <div className="video-player">
        {youtubeId ? (
          <iframe
            width="100%"
            height="200"
            src={`https://www.youtube.com/embed/${youtubeId}`}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        ) : (
          <video 
            src={video.url} 
            controls 
            width="100%" 
            height="auto"
          >
            Your browser does not support the video tag.
          </video>
        )}
      </div>
      <div className="video-info">
        <h3 className="video-title">{video.title}</h3>
        <p className="video-user-id">User ID: {video.idUser}</p>
      </div>
    </div>
  );
}

export default VideoItem;