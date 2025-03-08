import React from 'react';
import '../UserProfile.css';

function EditProfileButton({ onClick }) {
  return (
    <button onClick={onClick} className="edit-profile-button">
      Editar Perfil
    </button>
  );
}

export default EditProfileButton;
