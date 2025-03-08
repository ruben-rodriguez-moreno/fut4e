import React, { useState } from 'react';
import VideoCard from '../../Video/VideoCard';
import '../UserProfile.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilm, faHeart, faInfoCircle } from '@fortawesome/free-solid-svg-icons';

function ProfileDetails({ videos, user, currentUser, onLike, onComment, onDelete }) {
  const [activeTab, setActiveTab] = useState('videos');
  
  // Calcular estadísticas
  const totalLikes = videos.reduce((total, video) => total + (video.likes?.length || 0), 0);
  const totalComments = videos.reduce((total, video) => total + (video.comments?.length || 0), 0);
  
  return (
    <section className="profile-details">
      <div className="profile-tabs">
        <button 
          className={`tab-button ${activeTab === 'videos' ? 'active' : ''}`}
          onClick={() => setActiveTab('videos')}
        >
          <FontAwesomeIcon icon={faFilm} className="tab-icon" />
          Videos
        </button>
        <button 
          className={`tab-button ${activeTab === 'about' ? 'active' : ''}`}
          onClick={() => setActiveTab('about')}
        >
          <FontAwesomeIcon icon={faInfoCircle} className="tab-icon" />
          Acerca de
        </button>
      </div>
      
      <div className="tab-content">
        {activeTab === 'videos' && (
          <div className="videos-container">
            {videos.length > 0 ? (
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
            ) : (
              <div className="empty-content">
                <div className="empty-icon">📹</div>
                <p className="empty-message">Este usuario no ha publicado ningún video.</p>
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'about' && (
          <div className="about-section">
            <div className="bio-section">
              <h3 className="section-title">Biografía</h3>
              <p className="about-text">{user?.description || 'No hay información disponible.'}</p>
            </div>
            
            <div className="stats-section">
              <h3 className="section-title">Estadísticas</h3>
              <div className="user-stats">
                <div className="stat">
                  <span className="stat-number">{videos.length}</span>
                  <span className="stat-label">Videos</span>
                </div>
                <div className="stat">
                  <span className="stat-number">{totalLikes}</span>
                  <span className="stat-label">Likes</span>
                </div>
                <div className="stat">
                  <span className="stat-number">{totalComments}</span>
                  <span className="stat-label">Comentarios</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default ProfileDetails;
