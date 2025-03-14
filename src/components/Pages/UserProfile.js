import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import './UserProfile.css';
import ProfileCard from './UserProfile/ProfileCard';
import ProfileHeader from './UserProfile/ProfileHeader';
import ProfileDetails from './UserProfile/ProfileDetails';
import EditButton from './UserProfile/EditButton';
import ProfileEditForm from './UserProfile/ProfileEditForm';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import { API_BASE_URL, apiUrl } from '../../utils/apiConfig';


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
        // Validar que tenemos un nombre de usuario válido
        if (!username || username.trim() === '') {
          throw new Error('Nombre de usuario no válido o vacío');
        }
        
        // Codificar el nombre de usuario para URL segura
        const encodedUsername = encodeURIComponent(username);
        console.log(`Buscando usuario: ${username} (codificado como: ${encodedUsername})`);
        
        // Primero buscamos al usuario por nombre de usuario
        const response = await fetch(`https://fut4e.onrender.com/api/auth/username/${encodedUsername}`);
        
        // Log detallado para depuración
        console.log(`Respuesta del servidor: ${response.status} ${response.statusText}`);
        
        // Manejo específico para error 404
        if (response.status === 404) {
          throw new Error(`No se encontró el usuario "${username}". Verifica que el nombre de usuario sea correcto.`);
        }
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.error('Error desde el servidor:', errorData);
          throw new Error(errorData.error || `Error al buscar el usuario: ${response.statusText}`);
        }
        
        const userData = await response.json();
        
        // Validar que los datos recibidos son correctos
        if (!userData || !userData._id || !userData.username) {
          throw new Error('El servidor devolvió datos de usuario inválidos');
        }
        
        console.log('Datos del usuario obtenidos:', userData);
        setUser(userData);
        
        // Luego buscamos sus videos
        const videosResponse = await fetch(`https://fut4e.onrender.com/api/videos?author=${userData._id}`);
        
        if (!videosResponse.ok) {
          console.warn('No se pudieron cargar los videos:', videosResponse.status);
          setVideos([]);
        } else {
          const videosData = await videosResponse.json();
          setVideos(Array.isArray(videosData) ? videosData : []);
        }
      } catch (err) {
        console.error('Error completo:', err);
        setError(err.message || 'Error al cargar el perfil');
      } finally {
        setIsLoading(false);
      }
    };

    if (username) {
      fetchUserByUsername();
    } else {
      setError('No se especificó un nombre de usuario');
      setIsLoading(false);
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
  
  // Mejora en la pantalla de error
  if (error) return (
    <div className="user-profile-error">
      <div className="error-icon">⚠️</div>
      <h3>Ups, algo salió mal</h3>
      <p>{error}</p>
      <div className="error-actions">
        <button onClick={() => window.history.back()}>Volver</button>
        <button onClick={() => window.location.href = "/"}>Ir al inicio</button>
      </div>
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
            user={user}
            currentUser={currentUser}
            onLike={onLike}
            onComment={onComment}
            onDelete={onDelete}
          />
          <div className="profile-actions">
            {currentUser && user && currentUser._id === user._id && (
              <EditButton onClick={handleEditProfile} />
            )}
            <Link to={`/perfil/${user.username}`} className="btn btn-secondary view-public-button">
              <FontAwesomeIcon icon={faEye} className="action-icon" />
              Ver perfil público
            </Link>
          </div>
        </ProfileCard>
      )}
    </div>
  );
}

export default UserProfile;
