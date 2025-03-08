import React from 'react';
import '../UserProfile.css';

function ProfileCard({ children }) {
  return (
    <div className="profile-card">
      {children}
    </div>
  );
}

export default ProfileCard;
