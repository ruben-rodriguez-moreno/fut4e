import { useState } from 'react';
import { getFullImageUrl } from '../../utils/imageUtils';
import { API_BASE_URL, apiUrl } from '../../utils/apiConfig';


function EditProfile({ currentUser, onUpdateProfile }) {
  const [formData, setFormData] = useState({
    username: currentUser.username,
    description: currentUser.description || '',
    profilePicture: null,
    preview: getFullImageUrl(currentUser.profilePicture)
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setSuccess('');
    
    const form = new FormData();
    form.append('username', formData.username);
    form.append('description', formData.description);
    if (formData.profilePicture) {
      form.append('profilePicture', formData.profilePicture);
    }

    try {
      const response = await fetch(apiUrl('/api/auth/me'), {
        method: 'PUT',
        headers: {
          'x-auth-token': localStorage.getItem('token')
        },
        body: form
      });
      const data = await response.json();
      if (data.error) throw new Error(data.error);
      
      // Agregar timestamp para evitar caché
      if (data.profilePicture && !data.profilePicture.includes('?t=')) {
        data.profilePicture = `${data.profilePicture}?t=${Date.now()}`;
      }
      
      onUpdateProfile(data);
      setSuccess('¡Perfil actualizado con éxito!');
    } catch (err) {
      console.error(err);
      setError(err.message || 'Error al actualizar el perfil');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({ 
      ...formData, 
      profilePicture: file,
      preview: URL.createObjectURL(file)
    });
  };

  return (
    <div className="edit-profile-page">
      <h2>Editar Perfil</h2>
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      <form onSubmit={handleSubmit} className="edit-profile-form">
        <div className="profile-picture">
          <img src={formData.preview} alt="Perfil" />
          <label htmlFor="profilePicture" className="file-input-label">Cambiar foto de perfil</label>
          <input
            id="profilePicture"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>
        <input
          type="text"
          placeholder="Nombre de usuario"
          value={formData.username}
          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
        />
        <textarea
          placeholder="Descripción"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Actualizando...' : 'Actualizar Perfil'}
        </button>
      </form>
    </div>
  );
}

export default EditProfile;
