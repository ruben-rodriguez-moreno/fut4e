import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './UserProfile.css';
import ProfileCard from './UserProfile/ProfileCard';
import ProfileHeader from './UserProfile/ProfileHeader';
import ProfileDetails from './UserProfile/ProfileDetails';
import EditButton from './UserProfile/EditButton';
import ProfileEditForm from './UserProfile/ProfileEditForm';

function UserProfile({ currentUser, onLike, onComment, onDelete, onUpdateProfile }) {
  const { username } = useParams(); // Obtener el nombre de usuario de la URL
  const [user, setUser] = useState(null);
  const [videos, setVideos] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserByUsername = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Primero buscamos al usuario por nombre de usuario
        const response = await fetch(`http://localhost:5000/api/auth/username/${username}`);
        
        if (!response.ok) {
          throw new Error('No se pudo encontrar el usuario');
        }
        
        const userData = await response.json();
        setUser(userData);
        
        // Luego buscamos sus videos
        const videosResponse = await fetch(`http://localhost:5000/api/videos?author=${userData._id}`);
        
        if (!videosResponse.ok) {
          throw new Error('No se pudieron cargar los videos del usuario');
        }
        
        const videosData = await videosResponse.json();
        setVideos(videosData);
      } catch (err) {
        console.error(err);
        setError('Error al cargar el perfil: ' + err.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (username) {
      fetchUserByUsername();
    }
  }, [username]);

  const handleEditProfile = () => {
    // Solo permitir editar si es el perfil del usuario actual
    if (currentUser && user && currentUser._id === user._id) {
      setIsEditing(true);
    } else {
      alert('Solo puedes editar tu propio perfil');
    }
  };

  const handleSaveProfile = (updatedUser) => {
    setUser(updatedUser);
    setIsEditing(false);
    
    // Si el usuario actual está viendo su propio perfil, actualizar el estado global también
    if (currentUser && user && currentUser._id === user._id && typeof onUpdateProfile === 'function') {
      onUpdateProfile(updatedUser);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  if (isLoading) return (
    <div className="user-profile-loading">
      <div className="loading-spinner"></div>
      <p>Cargando perfil...</p>
    </div>
  );
  
  if (error) return (
    <div className="user-profile-error">
      <div className="error-icon">⚠️</div>
      <h3>Ups, algo salió mal</h3>
      <p>{error}</p>
      <button onClick={() => window.history.back()}>Volver</button>
    </div>
  );
  
  if (!user) return (
    <div className="user-profile-not-found">
      <div className="not-found-icon">🔍</div>
      <h3>Usuario no encontrado</h3>
      <p>No pudimos encontrar el usuario "{username}"</p>
      <button onClick={() => window.history.back()}>Volver</button>
    </div>
  );

  return (
    <div className="user-profile-container">
      {isEditing ? (
        <ProfileEditForm 
          user={user} 
          onSave={handleSaveProfile} 
          onCancel={handleCancelEdit} 
        />
      ) : (
        <ProfileCard>
          <ProfileHeader user={user} />
          <ProfileDetails 
            videos={videos}
            currentUser={currentUser}
            onLike={onLike}
            onComment={onComment}
            onDelete={onDelete}
          />
          {currentUser && user && currentUser._id === user._id && (
            <EditButton onClick={handleEditProfile} />
          )}
        </ProfileCard>
      )}
    </div>
  );
}

export default UserProfile;
