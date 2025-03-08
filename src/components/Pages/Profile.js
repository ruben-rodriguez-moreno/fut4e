import { useState, useEffect } from 'react';
import { getFullImageUrl } from '../../utils/imageUtils';

function Profile({ currentUser, onUpdateProfile }) {
  const [formData, setFormData] = useState({
    username: currentUser?.username || '',
    description: currentUser?.description || '',
  });
  const [profilePicture, setProfilePicture] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(currentUser?.profilePicture || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    // Update form data when currentUser changes
    if (currentUser) {
      setFormData({
        username: currentUser.username || '',
        description: currentUser.description || '',
      });
      // Usar getFullImageUrl para la URL de vista previa
      setPreviewUrl(getFullImageUrl(currentUser.profilePicture));
    }
  }, [currentUser]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicture(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ text: '', type: '' });

    try {
      // Create FormData object
      const form = new FormData();
      form.append('username', formData.username);
      form.append('description', formData.description);
      
      if (profilePicture) {
        form.append('profilePicture', profilePicture);
      }

      // Log form data for debugging
      console.log('Sending form data:', {
        username: formData.username,
        description: formData.description,
        profilePicture: profilePicture ? profilePicture.name : 'No file selected'
      });

      const response = await fetch('http://localhost:5000/api/auth/me', {
        method: 'PUT',
        headers: {
          'x-auth-token': localStorage.getItem('token')
        },
        body: form
      });

      const data = await response.json();
      
      if (response.ok) {
        // Agregar timestamp para evitar cache
        if (data.profilePicture && !data.profilePicture.includes('?t=')) {
          data.profilePicture = `${data.profilePicture}?t=${Date.now()}`;
        }
        onUpdateProfile(data);
        setMessage({ text: 'Profile updated successfully!', type: 'success' });
      } else {
        throw new Error(data.error || 'Failed to update profile');
      }
    } catch (err) {
      console.error('Update profile error:', err);
      setMessage({ text: err.message, type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="profile-page">
      <h2>My Profile</h2>
      
      {message.text && (
        <div className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-error'}`}>
          {message.text}
        </div>
      )}
      
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="profile-picture">
          <img 
            src={previewUrl || '/default-profile.png'} 
            alt="Profile Preview" 
            className="profile-preview"
            onError={(e) => {
              console.log('Error al cargar preview:', e.target.src);
              e.target.src = '/default-profile.png';
            }}
          />
          <div className="file-input-container">
            <input
              type="file"
              id="profile-picture"
              accept="image/*"
              onChange={handleFileChange}
              className="file-input"
            />
            <label htmlFor="profile-picture" className="file-label">
              Choose Profile Picture
            </label>
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="username">Username</label>
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
          <label htmlFor="description">About Me</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows="4"
          ></textarea>
        </div>
        
        <button 
          type="submit" 
          className="submit-btn"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Updating...' : 'Update Profile'}
        </button>
      </form>
    </div>
  );
}

export default Profile;
