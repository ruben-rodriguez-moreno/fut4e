import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUser, 
  faSearch, 
  faHome, 
  faFire, 
  faFolder, 
  faUpload, 
  faVideo, 
  faStar, 
  faUserCircle, 
  faEye, 
  faSignOutAlt,
  faCog
} from '@fortawesome/free-solid-svg-icons';
import { getFullImageUrl } from '../../utils/imageUtils';
import './Navigation.css';

function Navigation({ currentUser, searchQuery, onSearch, onShowAuth, onLogout, onUpload }) {
  const [showMenu, setShowMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const navigate = useNavigate();

  // Verificar si el usuario es administrador
  const isAdmin = currentUser && currentUser.email === process.env.REACT_APP_ADMIN_EMAIL;

  const handlePageChange = (path) => {
    navigate(path);
    setShowMenu(false);
    setShowProfileMenu(false);
  };

  return (
    <nav className="navbar">
      <div className="nav-left">
        <Link to="/" className="brand">FUT4E</Link>
        <div className="menu-container">
          <button 
            className="menu-trigger" 
            onClick={() => setShowMenu(!showMenu)}
            aria-label="Menu"
          >
            <div className="hamburger-icon">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </button>
          {showMenu && (
            <div className="context-menu">
              <div className="menu-section">
                <h3 className="menu-title">Explorar</h3>
                <Link to="/" className="menu-item" onClick={() => setShowMenu(false)}>
                  <FontAwesomeIcon icon={faHome} className="menu-icon" />
                  Inicio
                </Link>
                <Link to="/trending" className="menu-item" onClick={() => setShowMenu(false)}>
                  <FontAwesomeIcon icon={faFire} className="menu-icon" />
                  Tendencias
                </Link>
                <Link to="/categories" className="menu-item" onClick={() => setShowMenu(false)}>
                  <FontAwesomeIcon icon={faFolder} className="menu-icon" />
                  Categorías
                </Link>
              </div>
              
              {currentUser && (
                <div className="menu-section">
                  <h3 className="menu-title">Mi Contenido</h3>
                  <button 
                    className="menu-item"
                    onClick={onUpload}
                  >
                    <FontAwesomeIcon icon={faUpload} className="menu-icon" />
                    Subir Vídeo
                  </button>
                  <Link to="/myvideos" className="menu-item" onClick={() => setShowMenu(false)}>
                    <FontAwesomeIcon icon={faVideo} className="menu-icon" />
                    Mis Vídeos
                  </Link>
                  <Link to="/favorites" className="menu-item" onClick={() => setShowMenu(false)}>
                    <FontAwesomeIcon icon={faStar} className="menu-icon" />
                    Favoritos
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <div className="search-bar">
        <input 
          type="text" 
          placeholder="Buscar vídeos..." 
          value={searchQuery}
          onChange={(e) => onSearch(e)}
        />
        <button className="search-icon" aria-label="Search">
          <FontAwesomeIcon icon={faSearch} />
        </button>
      </div>
      {currentUser ? (
        <div className="user-controls">
          <div className="profile-menu">
            <button 
              className="profile-icon" 
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              aria-label="User menu"
            >
              {currentUser.profilePicture ? (
                <img
                  src={getFullImageUrl(currentUser.profilePicture)}
                  alt={currentUser.username}
                  className="user-avatar"
                  onError={(e) => {
                    e.target.src = '/default-profile.png';
                  }}
                />
              ) : (
                <FontAwesomeIcon icon={faUser} />
              )}
            </button>
            {showProfileMenu && (
              <div className="profile-context-menu">
                <div className="user-info">
                  <span className="username">{currentUser.username}</span>
                  <span className="email">{currentUser.email}</span>
                </div>
                <div className="menu-section">
                  <Link to="/profile" className="menu-item" onClick={() => setShowProfileMenu(false)}>
                    <FontAwesomeIcon icon={faUserCircle} className="menu-icon" />
                    Mi Perfil
                  </Link>
                  <Link 
                    to={`/perfil/${encodeURIComponent(currentUser.username)}`} 
                    className="menu-item" 
                    onClick={(e) => {
                      e.preventDefault(); // Prevenir navegación por defecto
                      
                      // Trim username para eliminar espacios en blanco
                      const cleanUsername = currentUser.username.trim();
                      const encodedUsername = encodeURIComponent(cleanUsername);
                      
                      // Verificar primero si el usuario existe
                      fetch(`http://localhost:5000/api/auth/username/${encodedUsername}`)
                        .then(response => {
                          if (response.ok) {
                            // Usuario existe, proceder a la navegación
                            navigate(`/perfil/${encodedUsername}`);
                          } else if (response.status === 404) {
                            // Intentar con búsqueda alternativa
                            return fetch(`http://localhost:5000/api/auth/search?username=${encodedUsername}`)
                              .then(searchResponse => {
                                if (searchResponse.ok) {
                                  return searchResponse.json();
                                }
                                throw new Error("Usuario no encontrado");
                              })
                              .then(searchResults => {
                                if (Array.isArray(searchResults) && searchResults.length > 0) {
                                  // Usar el nombre de usuario exacto del resultado encontrado
                                  const foundUser = searchResults[0];
                                  navigate(`/perfil/${encodeURIComponent(foundUser.username)}`);
                                } else {
                                  alert("No se pudo encontrar tu perfil de usuario");
                                }
                              });
                          } else {
                            alert("Error al cargar el perfil. Por favor, intenta de nuevo más tarde.");
                          }
                          setShowProfileMenu(false);
                        })
                        .catch(err => {
                          console.error("Error verificando usuario:", err);
                          alert("No se pudo verificar el perfil. Verifica tu conexión a internet.");
                          setShowProfileMenu(false);
                        });
                    }}
                  >
                    <FontAwesomeIcon icon={faEye} className="menu-icon" />
                    Ver Perfil Público
                  </Link>
                  {/* Mostrar enlace al panel admin solo para administradores */}
                  {isAdmin && (
                    <Link to="/admin" className="menu-item" onClick={() => setShowProfileMenu(false)}>
                      <FontAwesomeIcon icon={faCog} className="menu-icon" />
                      Panel Administrativo
                    </Link>
                  )}
                  <button 
                    className="menu-item"
                    onClick={() => {
                      onLogout();
                      setShowProfileMenu(false);
                      navigate('/');
                    }}
                  >
                    <FontAwesomeIcon icon={faSignOutAlt} className="menu-icon" />
                    Cerrar Sesión
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <button 
          className="auth-button" 
          onClick={onShowAuth}
          aria-label="Login"
        >
          <FontAwesomeIcon icon={faUser} />
        </button>
      )}
    </nav>
  );
}

export default Navigation;
