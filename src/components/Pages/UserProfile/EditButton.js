import React from 'react';
import '../UserProfile.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons';

function EditButton({ onClick }) {
  return (
    <button onClick={onClick} className="edit-profile-button">
      <FontAwesomeIcon icon={faPencilAlt} className="edit-icon" />
      <span>Editar Perfil</span>
    </button>
  );
}

export default EditButton;
