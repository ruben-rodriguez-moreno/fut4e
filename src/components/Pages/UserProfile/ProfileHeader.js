import React from 'react';
import '../UserProfile.css';
import { getFullImageUrl } from '../../../utils/imageUtils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt } from '@fortawesome/free-solid-svg-icons';

function ProfileHeader({ user }) {
  // Formatear la fecha de creación
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <header className="profile-header">
      <div className="profile-image-container">
        <img 
          src={getFullImageUrl(user.profilePicture)} 
          alt={user.username} 
          className="profile-pic" 
          onError={(e) => {
            e.target.src = '/default-profile.png';
          }}
        />
      </div>
      <div className="profile-info">
        <h2 className="profile-name">{user.username}</h2>
        <p className="profile-bio">{user.description || 'No hay descripción disponible.'}</p>
        <div className="profile-metadata">
          <span className="join-date">
            <FontAwesomeIcon icon={faCalendarAlt} className="date-icon" />
            Miembro desde {formatDate(user.createdAt)}
          </span>
        </div>
      </div>
    </header>
  );
}

export default ProfileHeader;
