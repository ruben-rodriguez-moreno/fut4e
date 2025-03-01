import React from 'react';
import VideoCard from '../Video/VideoCard';

function Categories({ videos, currentUser, onLike, onComment, onDelete }) {
  const categories = {
    football: 'Football',
    skills: 'Skills',
    highlights: 'Highlights'
  };

  return (
    <div className="page-container">
      <h2>Categories</h2>
      <div className="categories-grid">
        {Object.entries(categories).map(([key, name]) => {
          const categoryVideos = videos.filter(video => video.category === key);
          
          return (
            <div key={key} className="category-card">
              <h3>{name}</h3>
              <div className="video-grid">
                {categoryVideos.length > 0 ? (
                  categoryVideos.map(video => (
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
                  <div className="empty-category">No videos in this category</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Categories;