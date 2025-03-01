import React from 'react';
import VideoCard from '../Video/VideoCard';

function Home({ videos, currentUser, onLike, onComment, onDelete }) {
  return (
    <div className="video-grid">
      {videos.map(video => (
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
  );
}

export default Home;