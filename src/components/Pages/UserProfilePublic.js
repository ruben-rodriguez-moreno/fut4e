import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getFullImageUrl } from '../../utils/imageUtils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilm, faHeart, faInfoCircle, faCalendarAlt, faComment, faStar } from '@fortawesome/free-solid-svg-icons';
import VideoCard from '../Video/VideoCard';

// Importamos los estilos globales (además de los estilos específicos)
import '../../styles/GlobalStyles.css';
import './UserProfilePublic.css';

function UserProfilePublic({ onLike, onComment, currentUser }) {
  // Obtener el nombre de usuario de los parámetros de URL
  const { username } = useParams();
  
  // Estados para manejar los datos y estado de la UI
  const [user, setUser] = useState(null);
  const [videos, setVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('videos');

  useEffect(() => {
    const fetchUserByUsername = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Validar nombre de usuario con mensaje de error más específico
        if (!username || username.trim() === '') {
          throw new Error('No se proporcionó un nombre de usuario válido');
        }
        
        // Codificar el nombre de usuario para URL segura y eliminar espacios en blanco
        const cleanUsername = username.trim();
        const encodedUsername = encodeURIComponent(cleanUsername);
        console.log(`Buscando perfil público: ${cleanUsername} (codificado: ${encodedUsername})`);
        
        const response = await fetch(`http://https://fut4e.onrender.com/api/auth/username/${encodedUsername}`);
        console.log(`Respuesta del servidor: ${response.status} ${response.statusText}`);
        
        // Si obtenemos un 404, intentar una búsqueda más flexible
        if (response.status === 404) {
          console.log(`Usuario no encontrado con búsqueda exacta. Intentando búsqueda alternativa...`);
          // Intentar con la API de búsqueda
          const searchResponse = await fetch(`http://https://fut4e.onrender.com/api/auth/search?username=${encodedUsername}`);
          
          if (searchResponse.ok) {
            const searchResults = await searchResponse.json();
            
            // Si encontramos resultados similares, usar el primero
            if (Array.isArray(searchResults) && searchResults.length > 0) {
              const closestMatch = searchResults.find(
                user => user.username.toLowerCase() === cleanUsername.toLowerCase()
              ) || searchResults[0];
              
              console.log(`Encontrado usuario similar: ${closestMatch.username}`);
              setUser(closestMatch);
              
              // Cargar los videos del usuario encontrado
              const videosResponse = await fetch(`http://https://fut4e.onrender.com/api/videos?author=${closestMatch._id}`);
              if (videosResponse.ok) {
                const videosData = await videosResponse.json();
                setVideos(Array.isArray(videosData) ? videosData : []);
              }
              
              setIsLoading(false);
              return;
            }
          }
          
          throw new Error(`El usuario "${cleanUsername}" no existe en nuestra base de datos. Verifica que el nombre esté escrito correctamente.`);
        }
        
        if (!response.ok) {
          const errorText = await response.text();
          let errorMessage = 'Error desconocido al buscar el usuario';
          try {
            const errorJson = JSON.parse(errorText);
            errorMessage = errorJson.error || errorMessage;
          } catch (e) {
            // Si no es JSON, usar el texto como está
            if (errorText) errorMessage = errorText;
          }
          throw new Error(errorMessage);
        }
        
        const userData = await response.json();
        
        // Validación más robusta de datos de usuario
        if (!userData || typeof userData !== 'object') {
          throw new Error('Formato de datos de usuario inválido');
        }
        
        if (!userData._id) {
          throw new Error('ID de usuario no encontrado en la respuesta');
        }
        
        console.log('Datos de perfil obtenidos correctamente:', userData);
        setUser(userData);
        
        // Obtener videos con mejor manejo de errores
        const videosResponse = await fetch(`http://https://fut4e.onrender.com/api/videos?author=${userData._id}`);
        
        if (!videosResponse.ok) {
          console.warn(`No se pudieron cargar los videos: ${videosResponse.status} - ${videosResponse.statusText}`);
          setVideos([]);
        } else {
          const videosData = await videosResponse.json();
          if (!Array.isArray(videosData)) {
            console.warn('Los datos de videos no son un array:', videosData);
            setVideos([]);
          } else {
            setVideos(videosData);
          }
        }
      } catch (err) {
        console.error('Error al cargar perfil público:', err);
        setError(err.message || 'Error desconocido al cargar el perfil');
      } finally {
        setIsLoading(false);
      }
    };

    if (username) {
      fetchUserByUsername();
    } else {
      setError('URL inválida: no se especificó un nombre de usuario');
      setIsLoading(false);
    }
  }, [username]);

  // Función para formatear fechas
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Calcular estadísticas
  const calculateStats = () => {
    const totalLikes = videos.reduce((total, video) => total + (video.likes?.length || 0), 0);
    const totalComments = videos.reduce((total, video) => total + (video.comments?.length || 0), 0);
    
    return {
      totalVideos: videos.length,
      totalLikes,
      totalComments
    };
  };

  // Función para verificar si el usuario es destacado (más de 5 videos)
  const isFeaturedCreator = (videosCount) => videosCount >= 5;

  // Renderizado condicional para estados de carga
  if (isLoading) {
    return (
      <div className="container">
        <div className="user-profile-loading">
          <div className="loading-spinner"></div>
          <p className="text-muted">Cargando perfil...</p>
        </div>
      </div>
    );
  }

  // Página de error mejorada
  if (error) {
    return (
      <div className="container">
        <div className="user-profile-error">
          <div className="error-icon">⚠️</div>
          <h3>Ha ocurrido un error</h3>
          <p className="text-muted mb-4">{error}</p>
          <div className="error-actions">
            <button className="btn btn-primary" onClick={() => window.history.back()}>Volver</button>
            <button className="btn btn-secondary" onClick={() => window.location.href = "/"}>Ir al inicio</button>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container">
        <div className="user-profile-not-found">
          <div className="not-found-icon">🔍</div>
          <h3>Usuario no encontrado</h3>
          <p className="text-muted mb-4">No pudimos encontrar al usuario "{username}"</p>
          <button className="btn btn-primary" onClick={() => window.history.back()}>Volver</button>
        </div>
      </div>
    );
  }

  const stats = calculateStats();
  const userIsFeatured = isFeaturedCreator(stats.totalVideos);

  return (
    <div className="container">
      <div className="user-profile-public-container">
        <div className="profile-card">
          {/* Cabecera del perfil mejorada */}
          <header className="profile-header">
            <div className="profile-header-content">
              <div className="profile-image-container">
                <img 
                  src={getFullImageUrl(user.profilePicture)} 
                  alt={user.username} 
                  className="profile-pic" 
                  onError={(e) => {
                    e.target.src = '/default-profile.png';
                  }}
                />
                {userIsFeatured && (
                  <div className="featured-badge" title="Creador Destacado">
                    <FontAwesomeIcon icon={faStar} />
                  </div>
                )}
              </div>
              <div className="profile-info">
                <div className="profile-name-container">
                  <h2 className="profile-name">{user.username}</h2>
                  {currentUser && currentUser._id === user._id && (
                    <span className="profile-owner-badge">Tú</span>
                  )}
                </div>
                <p className="profile-bio">{user.description || 'Sin descripción.'}</p>
                <div className="profile-metadata">
                  <span className="join-date">
                    <FontAwesomeIcon icon={faCalendarAlt} className="date-icon" />
                    <span className="text-muted">Miembro desde {formatDate(user.createdAt)}</span>
                  </span>
                </div>
              </div>
            </div>
            
            {/* Resumen de estadísticas en la cabecera */}
            <div className="profile-stats-summary">
              <div className="stat-item">
                <span className="stat-value">{stats.totalVideos}</span>
                <span className="stat-label">Videos</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">{stats.totalLikes}</span>
                <span className="stat-label">Likes</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">{stats.totalComments}</span>
                <span className="stat-label">Comentarios</span>
              </div>
            </div>
          </header>

          {/* Contenido del perfil */}
          <section className="profile-details">
            <div className="profile-tabs">
              <button 
                className={`tab-button ${activeTab === 'videos' ? 'active' : ''}`}
                onClick={() => setActiveTab('videos')}
                aria-label="Ver videos"
              >
                <FontAwesomeIcon icon={faFilm} className="tab-icon" />
                Videos
              </button>
              <button 
                className={`tab-button ${activeTab === 'about' ? 'active' : ''}`}
                onClick={() => setActiveTab('about')}
                aria-label="Ver información"
              >
                <FontAwesomeIcon icon={faInfoCircle} className="tab-icon" />
                Acerca de
              </button>
            </div>
            
            <div className="tab-content">
              {activeTab === 'videos' && (
                <div className="videos-container">
                  {videos.length > 0 ? (
                    <>
                      <div className="videos-header">
                        <h3 className="section-title">Videos publicados</h3>
                        <span className="video-count">{videos.length} {videos.length === 1 ? 'video' : 'videos'}</span>
                      </div>
                      <div className="video-grid animated-grid">
                        {videos.map(video => (
                          <VideoCard 
                            key={video._id} 
                            video={video}
                            currentUser={currentUser}
                            onLike={onLike}
                            onComment={onComment}
                            showAuthor={false}
                          />
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="empty-content">
                      <div className="empty-icon">📹</div>
                      <p className="empty-message">Este usuario no ha publicado ningún video.</p>
                      {currentUser && currentUser._id === user._id && (
                        <Link to="/upload" className="btn btn-primary mt-3">
                          Publicar primer video
                        </Link>
                      )}
                    </div>
                  )}
                </div>
              )}
              
              {activeTab === 'about' && (
                <div className="about-section animated-container">
                  <div className="bio-section">
                    <h3 className="section-title">Biografía</h3>
                    <p className="about-text">{user?.description || 'No hay información disponible.'}</p>
                  </div>
                  
                  <div className="stats-section">
                    <h3 className="section-title">Estadísticas detalladas</h3>
                    <div className="user-stats">
                      <div className="stat">
                        <span className="stat-number">{stats.totalVideos}</span>
                        <span className="stat-label">Videos</span>
                      </div>
                      <div className="stat">
                        <span className="stat-number">{stats.totalLikes}</span>
                        <span className="stat-label">Likes</span>
                      </div>
                      <div className="stat">
                        <span className="stat-number">{stats.totalComments}</span>
                        <span className="stat-label">Comentarios</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default UserProfilePublic;
