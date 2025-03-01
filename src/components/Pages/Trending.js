import React from 'react';
import VideoCard from '../Video/VideoCard';

function Trending({ videos, currentUser, onLike, onComment, onDelete }) {
  const trendingVideos = videos.sort((a, b) => b.likes.length - a.likes.length);
  
  return (
    <div className="page-container">
      <h2>Trending Videos</h2>
      <div className="video-grid">
        {trendingVideos.map(video => (
          <VideoCard 
            key={video._id} 
            video={video}
            currentUser={currentUser}
            onLike={onLike}
            onComment={onComment}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
}

export default Trending;