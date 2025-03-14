import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faUser, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { getFullImageUrl } from '../../utils/imageUtils';
import './UserSearch.css';

function UserSearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) {
      setError('Por favor ingresa un nombre de usuario para buscar.');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setHasSearched(true);
    
    try {
      // Limpiamos y codificamos el término de búsqueda
      const cleanQuery = searchQuery.trim();
      const encodedQuery = encodeURIComponent(cleanQuery);
      
      console.log(`Buscando usuarios con la consulta: "${cleanQuery}"`);
      
      const response = await fetch(`http://https://fut4e.onrender.com/api/auth/search?username=${encodedQuery}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          console.log('No se encontraron resultados');
          setSearchResults([]);
          setIsLoading(false);
          return;
        }
        throw new Error('Error en la búsqueda. Por favor intenta de nuevo.');
      }
      
      const data = await response.json();
      
      if (!Array.isArray(data)) {
        console.warn('Respuesta de búsqueda no es un array:', data);
        setSearchResults([]);
      } else {
        console.log(`Se encontraron ${data.length} usuarios`);
        setSearchResults(data);
      }
    } catch (err) {
      console.error('Error en búsqueda:', err);
      setError(err.message || 'Error al buscar usuarios');
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="user-search-container">
      <div className="search-header">
        <h1>Buscar Usuarios</h1>
        <p>Encuentra perfiles de usuarios en nuestra plataforma</p>
      </div>
      
      <form onSubmit={handleSearch} className="user-search-form">
        <div className="search-input-container">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Ingresa un nombre de usuario..."
            className="search-input"
          />
          <button 
            type="submit" 
            className="search-button" 
            disabled={isLoading}
            aria-label="Buscar usuarios"
          >
            {isLoading ? (
              <span className="loading-spinner-small"></span>
            ) : (
              <FontAwesomeIcon icon={faSearch} className="search-icon" />
            )}
          </button>
        </div>
        
        {error && (
          <div className="search-error">
            <FontAwesomeIcon icon={faExclamationTriangle} /> {error}
          </div>
        )}
      </form>
      
      <div className="search-results">
        {isLoading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Buscando usuarios...</p>
          </div>
        ) : hasSearched ? (
          <>
            {searchResults.length > 0 ? (
              <>
                <h2>Resultados de búsqueda</h2>
                <div className="user-list">
                  {searchResults.map(user => (
                    <Link to={`/perfil/${user.username}`} key={user._id} className="user-card">
                      <div className="user-avatar-container">
                        <img 
                          src={getFullImageUrl(user.profilePicture)} 
                          alt={user.username}
                          className="user-avatar"
                          onError={(e) => { e.target.src = '/default-profile.png'; }}
                        />
                      </div>
                      <div className="user-info">
                        <h3>{user.username}</h3>
                        <p>{user.description || 'Sin descripción'}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </>
            ) : (
              <div className="no-results">
                <FontAwesomeIcon icon={faUser} className="empty-icon" />
                <h3>No se encontraron usuarios</h3>
                <p>No hay usuarios que coincidan con "{searchQuery}".</p>
              </div>
            )}
          </>
        ) : (
          <div className="search-instructions">
            <h3>¿Buscas a alguien?</h3>
            <p>Usa el campo de búsqueda para encontrar perfiles de usuarios</p>
            <p>También puedes explorar videos en la página principal para descubrir creadores</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default UserSearch;
