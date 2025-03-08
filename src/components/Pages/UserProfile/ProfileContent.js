import React from 'react';
import VideoCard from '../../Video/VideoCard';
import '../UserProfile.css';

function ProfileContent({ videos, currentUser, onLike, onComment, onDelete }) {
  return (
    <section className="profile-content">
      <div className="video-grid">
        {videos.length > 0 ? (
          videos.map(video => (
            <VideoCard 
              key={video._id} 
              video={video}
              currentUser={currentUser}
              onLike={onLike}
              onComment={onComment}
              onDelete={onDelete}
            />
          ))
        ) : (
          <p className="empty-content-message">Este usuario no ha publicado ningún video.</p>
        )}
      </div>
    </section>
  );
}

export default ProfileContent;
