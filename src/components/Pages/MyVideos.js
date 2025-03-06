import React from 'react';
import VideoCard from '../Video/VideoCard';

function MyVideos({ videos, currentUser, onLike, onComment, onDelete }) {
  const userVideos = videos.filter(video => 
    video.author?._id === currentUser?._id
  );

  return (
    <div className="page-container">
      <h2>My Videos</h2>
      <div className="video-grid animated-grid">
        {userVideos.map(video => (
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

export default MyVideos;