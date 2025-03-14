import React from 'react';
import VideoCard from '../Video/VideoCard';

function MyVideos({ videos, currentUser, onLike, onComment, onDelete, onUpload }) {
  const userVideos = videos.filter(video => 
    video.author?._id === currentUser?._id
  );

  const handleUploadClick = () => {
    // If onUpload function is available, use it directly
    if (typeof onUpload === 'function') {
      onUpload();
    } else {
      // Otherwise, just dispatch the showUpload event
      window.dispatchEvent(new CustomEvent('showUpload'));
      
      // REMOVE the showAuth event dispatch which is causing the conflict
      // This event is showing the registration form instead of the upload dialog
    }
  };

  return (
    <div className="page-container">
      <h2>Mis Vídeos</h2>
      {userVideos.length > 0 ? (
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
      ) : (
        <div className="empty-content">
          <div className="empty-icon">📹</div>
          <p className="empty-message">No has publicado ningún vídeo todavía.</p>
          <button 
            onClick={handleUploadClick} 
            className="action-button"
          >
            Subir mi primer vídeo
          </button>
        </div>
      )}
    </div>
  );
}

export default MyVideos;