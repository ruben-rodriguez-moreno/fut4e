import React from 'react';
import VideoCard from '../Video/VideoCard';

function Favorites({ videos, currentUser, onLike, onComment }) {
  const favoriteVideos = videos.filter(video => 
    video.likes.some(like => like._id === currentUser?._id)
  );

  return (
    <div className="page-container">
      <h2>My Favorite Videos</h2>
      <div className="video-grid animated-grid">
        {favoriteVideos.map(video => (
          <VideoCard 
            key={video._id} 
            video={video}
            currentUser={currentUser}
            onLike={onLike}
            onComment={onComment}
          />
        ))}
      </div>
    </div>
  );
}

export default Favorites;