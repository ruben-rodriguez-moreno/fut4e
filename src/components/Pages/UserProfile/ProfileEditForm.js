import React, { useState } from 'react';
import '../UserProfile.css';
import { getFullImageUrl } from '../../../utils/imageUtils';

function ProfileEditForm({ user, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    username: user.username || '',
    description: user.description || '',
    profilePicture: null
  });
  
  // Usamos la función de utilidad para la URL de la vista previa
  const [previewUrl, setPreviewUrl] = useState(getFullImageUrl(user.profilePicture));
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, profilePicture: file }));
      // Aquí usamos URL.createObjectURL porque es un archivo local que acabamos de seleccionar
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Crear FormData para enviar archivos
      const form = new FormData();
      form.append('username', formData.username);
      form.append('description', formData.description);
      
      if (formData.profilePicture) {
        form.append('profilePicture', formData.profilePicture);
      }

      const response = await fetch(`http://localhost:5000/api/auth/me`, {
        method: 'PUT',
        headers: {
          'x-auth-token': localStorage.getItem('token')
        },
        body: form
      });

      if (!response.ok) {
        throw new Error('Error al actualizar el perfil');
      }

      const updatedUser = await response.json();
      
      // Agregar timestamp para evitar caché
      if (updatedUser.profilePicture && !updatedUser.profilePicture.includes('?t=')) {
        updatedUser.profilePicture = `${updatedUser.profilePicture}?t=${Date.now()}`;
      }
      
      console.log('Perfil actualizado con éxito:', updatedUser);
      onSave(updatedUser);
    } catch (error) {
      console.error('Error actualizando el perfil:', error);
      alert('No se pudo actualizar el perfil: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="profile-edit-form">
      <h3>Editar Perfil</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="profile-picture">Foto de perfil</label>
          <div className="profile-picture-container">
            <img 
              src={previewUrl} 
              alt="Vista previa" 
              className="profile-preview"
              onError={(e) => {
                console.log('Error al cargar la vista previa:', e.target.src);
                e.target.src = '/default-profile.png';
              }} 
            />
            <input
              type="file"
              id="profile-picture"
              accept="image/*"
              onChange={handleFileChange}
              className="file-input"
            />
            <label htmlFor="profile-picture" className="file-input-label">
              Cambiar imagen
            </label>
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="username">Nombre de usuario</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="description">Descripción</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows="4"
          />
        </div>
        
        <div className="form-actions">
          <button 
            type="button" 
            onClick={onCancel}
            className="cancel-button"
            disabled={isSubmitting}
          >
            Cancelar
          </button>
          <button 
            type="submit" 
            className="save-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ProfileEditForm;
