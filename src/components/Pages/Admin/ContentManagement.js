import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../../../utils/apiConfig';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSearch, faFilter, faTrashAlt, faStar, 
  faEye, faSort, faExclamationTriangle,
  faSortAmountDown, faSortAmountUp, faCheckCircle,
  faInfoCircle, faCalendarAlt, faTag, faHeart,
  faComment, faUser, faVideo, faTimesCircle
} from '@fortawesome/free-solid-svg-icons';
import { getFullImageUrl } from '../../../utils/imageUtils';
import './AdminDashboard.css';

function ContentManagement() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [sortOrder, setSortOrder] = useState('newest');
  const [confirmAction, setConfirmAction] = useState(null);
  const [loadingAction, setLoadingAction] = useState(false);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/videos/all`, {
        headers: {
          'x-auth-token': localStorage.getItem('token')
        }
      });

      if (!response.ok) {
        throw new Error('No se pudieron cargar los videos');
      }

      const data = await response.json();
      setVideos(data);
      setError(null);
    } catch (err) {
      console.error('Error al cargar videos:', err);
      setError(err.message || 'Error al obtener la lista de videos');
      setVideos([]);
    } finally {
      setLoading(false);
    }
  };

  const deleteVideo = async (videoId) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este video? Esta acción no se puede deshacer.')) {
      return;
    }
    
    setLoadingAction(true);
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/videos/${videoId}`, {
        method: 'DELETE',
        headers: {
          'x-auth-token': localStorage.getItem('token')
        }
      });

      if (!response.ok) {
        throw new Error('No se pudo eliminar el video');
      }

      setVideos(videos.filter(video => video._id !== videoId));
      
      if (selectedVideo && selectedVideo._id === videoId) {
        setSelectedVideo(null);
      }

      setConfirmAction({
        type: 'success',
        message: 'Video eliminado exitosamente',
        icon: faCheckCircle
      });

      setTimeout(() => setConfirmAction(null), 3000);
    } catch (err) {
      console.error('Error al eliminar video:', err);
      setConfirmAction({
        type: 'error',
        message: `Error: ${err.message}`,
        icon: faTimesCircle
      });
      setTimeout(() => setConfirmAction(null), 3000);
    } finally {
      setLoadingAction(false);
    }
  };

  const featureVideo = async (videoId, featured) => {
    setLoadingAction(true);
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/videos/${videoId}/feature`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': localStorage.getItem('token')
        },
        body: JSON.stringify({ featured })
      });

      if (!response.ok) {
        throw new Error(featured ? 'No se pudo destacar el video' : 'No se pudo quitar el destacado del video');
      }

      const updatedVideo = await response.json();
      
      setVideos(videos.map(video => 
        video._id === videoId ? updatedVideo : video
      ));
      
      if (selectedVideo && selectedVideo._id === videoId) {
        setSelectedVideo(updatedVideo);
      }

      setConfirmAction({
        type: 'success',
        message: featured ? 'Video destacado exitosamente' : 'Video quitado de destacados exitosamente',
        icon: featured ? faStar : faCheckCircle
      });

      setTimeout(() => setConfirmAction(null), 3000);
    } catch (err) {
      console.error('Error al actualizar estado de destacado:', err);
      setConfirmAction({
        type: 'error',
        message: `Error: ${err.message}`,
        icon: faTimesCircle
      });
      setTimeout(() => setConfirmAction(null), 3000);
    } finally {
      setLoadingAction(false);
    }
  };

  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric', 
      hour: 'numeric', 
      minute: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatDateShort = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return `Hoy, ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    } else if (date.toDateString() === yesterday.toDateString()) {
      return `Ayer, ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    } else {
      return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // La búsqueda se realiza en el cliente
  };

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'newest' ? 'oldest' : 'newest');
  };

  const getCategoryLabel = (category) => {
    const categories = {
      'football': 'Fútbol',
      'skills': 'Habilidades',
      'highlights': 'Momentos destacados'
    };
    return categories[category] || category;
  };

  const getCategoryIcon = (category) => {
    const icons = {
      'football': '⚽',
      'skills': '🎯',
      'highlights': '🏆'
    };
    return icons[category] || '📹';
  };

  // Filtrar y ordenar videos
  const filteredVideos = videos
    .filter(video => {
      // Filtro por estado
      if (filter === 'all') return true;
      if (filter === 'reported') return video.flags && video.flags.length > 0;
      if (filter === 'featured') return video.featured;
      return true;
    })
    .filter(video => {
      // Filtro por categoría
      if (categoryFilter === 'all') return true;
      return video.category === categoryFilter;
    })
    .filter(video => {
      // Filtro por búsqueda
      if (!searchQuery) return true;
      const query = searchQuery.toLowerCase();
      return (
        video.title?.toLowerCase().includes(query) ||
        video.description?.toLowerCase().includes(query) ||
        (video.author && video.author.username && video.author.username.toLowerCase().includes(query))
      );
    })
    .sort((a, b) => {
      // Ordenar por fecha
      if (sortOrder === 'newest') {
        return new Date(b.createdAt) - new Date(a.createdAt);
      } else {
        return new Date(a.createdAt) - new Date(b.createdAt);
      }
    });

  // Contar videos por categoría
  const videoCounts = {
    total: videos.length,
    reported: videos.filter(video => video.flags && video.flags.length > 0).length,
    featured: videos.filter(video => video.featured).length
  };

  return (
    <div className="content-management">
      <div className="admin-header">
        <div className="header-title">
          <h2>
            <FontAwesomeIcon icon={faVideo} className="section-icon" /> 
            Gestión de Contenido
          </h2>
          <p className="video-stats">
            {videoCounts.total} videos • {videoCounts.featured} destacados • {videoCounts.reported} reportados
          </p>
        </div>
        
        <div className="filter-controls">
          {/* Status filter */}
          <div className="filter-group">
            <FontAwesomeIcon icon={faFilter} className="filter-icon" />
            <select 
              value={filter} 
              onChange={(e) => setFilter(e.target.value)}
              className="status-filter"
            >
              <option value="all">Todos los videos</option>
              <option value="reported">Reportados</option>
              <option value="featured">Destacados</option>
            </select>
          </div>

          {/* Category filter */}
          <div className="filter-group">
            <FontAwesomeIcon icon={faTag} className="filter-icon" />
            <select 
              value={categoryFilter} 
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="category-filter"
            >
              <option value="all">Todas las categorías</option>
              <option value="football">Fútbol</option>
              <option value="skills">Habilidades</option>
              <option value="highlights">Momentos destacados</option>
            </select>
          </div>

          {/* Sort order toggle */}
          <button
            className="sort-toggle"
            onClick={toggleSortOrder}
            title={sortOrder === 'newest' ? 'Más recientes primero' : 'Más antiguos primero'}
          >
            <FontAwesomeIcon 
              icon={sortOrder === 'newest' ? faSortAmountDown : faSortAmountUp} 
            />
          </button>
        </div>
      </div>

      {/* Search bar */}
      <form onSubmit={handleSearch} className="video-search-form">
        <div className="search-input-container">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por título, descripción o autor..."
            className="search-input"
          />
          <button type="submit" className="search-button">
            <FontAwesomeIcon icon={faSearch} />
          </button>
        </div>
      </form>

      {/* Action feedback */}
      {confirmAction && (
        <div className={`action-feedback ${confirmAction.type}`}>
          {confirmAction.icon && <FontAwesomeIcon icon={confirmAction.icon} className="feedback-icon" />}
          {confirmAction.message}
        </div>
      )}

      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Cargando videos...</p>
        </div>
      ) : error ? (
        <div className="error-container">
          <FontAwesomeIcon icon={faExclamationTriangle} className="error-icon" />
          <p>{error}</p>
          <button onClick={fetchVideos} className="retry-button">Reintentar</button>
        </div>
      ) : (
        <div className="videos-content">
          <div className="videos-list">
            {filteredVideos.length > 0 ? filteredVideos.map(video => (
              <div 
                key={video._id} 
                className={`video-item ${selectedVideo && selectedVideo._id === video._id ? 'active' : ''}`}
                onClick={() => setSelectedVideo(video)}
              >
                <div className="video-thumbnail-container">
                  <img 
                    src={getFullImageUrl(video.thumbnailUrl)} 
                    alt={video.title}
                    className="video-thumbnail"
                    onError={(e) => { e.target.src = `${API_BASE_URL}/default-thumbnail.jpg`; }}
                  />
                  {video.flags && video.flags.length > 0 && (
                    <div className="video-flag" title={`${video.flags.length} reportes`}>
                      <FontAwesomeIcon icon={faExclamationTriangle} />
                      <span className="flag-count">{video.flags.length}</span>
                    </div>
                  )}
                  {video.featured && (
                    <div className="video-featured" title="Video destacado">
                      <FontAwesomeIcon icon={faStar} />
                    </div>
                  )}
                </div>
                <div className="video-info">
                  <h3 className="video-title">{video.title}</h3>
                  <span className="video-author">
                    <FontAwesomeIcon icon={faUser} className="info-icon" />
                    {video.author ? video.author.username : 'Usuario desconocido'}
                  </span>
                  <div className="video-meta">
                    <span className="video-category">
                      {getCategoryIcon(video.category)} {getCategoryLabel(video.category)}
                    </span>
                    <span className="video-date">
                      <FontAwesomeIcon icon={faCalendarAlt} className="info-icon" />
                      {formatDateShort(video.createdAt)}
                    </span>
                  </div>
                </div>
              </div>
            )) : (
              <div className="no-videos">
                <FontAwesomeIcon icon={faVideo} className="empty-icon" />
                <p>
                  No hay videos {filter !== 'all' ? `con estado "${filter}"` : ''} 
                  {categoryFilter !== 'all' ? ` en la categoría "${getCategoryLabel(categoryFilter)}"` : ''}
                  {searchQuery && ` que coincidan con "${searchQuery}"`}
                </p>
                <button onClick={() => {
                  setFilter('all');
                  setCategoryFilter('all');
                  setSearchQuery('');
                }} className="clear-filters-btn">Limpiar filtros</button>
              </div>
            )}
          </div>

          <div className="video-detail">
            {selectedVideo ? (
              <div className="detail-content">
                <div className="detail-header">
                  <div className="detail-title-container">
                    <h3>{selectedVideo.title}</h3>
                    {selectedVideo.featured && (
                      <span className="detail-featured-badge">
                        <FontAwesomeIcon icon={faStar} /> Destacado
                      </span>
                    )}
                  </div>
                  <div className="action-controls" style={{display: 'flex', opacity: 1}}>
                    <button 
                      onClick={() => window.open(`/video/${selectedVideo._id}`, '_blank')}
                      className="view-button"
                      title="Ver video"
                      disabled={loadingAction}
                      style={{opacity: 1}}
                    >
                      <FontAwesomeIcon icon={faEye} />
                    </button>
                    
                    {selectedVideo.featured ? (
                      <button 
                        onClick={() => featureVideo(selectedVideo._id, false)} 
                        className="unfeature-button"
                        title="Quitar de destacados"
                        disabled={loadingAction}
                        style={{opacity: 1}}
                      >
                        <FontAwesomeIcon icon={faStar} style={{ opacity: 0.7 }} />
                      </button>
                    ) : (
                      <button 
                        onClick={() => featureVideo(selectedVideo._id, true)} 
                        className="feature-button"
                        title="Destacar video"
                        disabled={loadingAction}
                        style={{opacity: 1}}
                      >
                        <FontAwesomeIcon icon={faStar} />
                      </button>
                    )}

                    <button 
                      onClick={() => deleteVideo(selectedVideo._id)} 
                      className="delete-button"
                      title="Eliminar video"
                      disabled={loadingAction}
                      style={{opacity: 1}}
                    >
                      <FontAwesomeIcon icon={faTrashAlt} />
                    </button>
                  </div>
                </div>

                <div className="detail-preview">
                  <div className="video-preview-container">
                    <img 
                      src={getFullImageUrl(selectedVideo.thumbnailUrl)} 
                      alt={selectedVideo.title}
                      className="video-preview-image"
                      onError={(e) => { e.target.src = `${API_BASE_URL}/default-thumbnail.jpg`; }}
                    />
                    {selectedVideo.featured && (
                      <div className="featured-badge">
                        <FontAwesomeIcon icon={faStar} /> Destacado
                      </div>
                    )}
                  </div>
                </div>

                <div className="detail-stats">
                  <div className="stat-item">
                    <FontAwesomeIcon icon={faHeart} className="stat-icon likes-icon" />
                    <div>
                      <span className="stat-value">{selectedVideo.likes ? selectedVideo.likes.length : 0}</span>
                      <span className="stat-label">Likes</span>
                    </div>
                  </div>
                  <div className="stat-item">
                    <FontAwesomeIcon icon={faComment} className="stat-icon comments-icon" />
                    <div>
                      <span className="stat-value">{selectedVideo.comments ? selectedVideo.comments.length : 0}</span>
                      <span className="stat-label">Comentarios</span>
                    </div>
                  </div>
                  {selectedVideo.flags && selectedVideo.flags.length > 0 && (
                    <div className="stat-item reports-item">
                      <FontAwesomeIcon icon={faExclamationTriangle} className="stat-icon reports-icon" />
                      <div>
                        <span className="stat-value">{selectedVideo.flags.length}</span>
                        <span className="stat-label">Reportes</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="detail-info">
                  <h4 className="info-section-title">
                    <FontAwesomeIcon icon={faInfoCircle} /> Información
                  </h4>
                  <p><strong>Autor:</strong> {selectedVideo.author ? selectedVideo.author.username : 'Usuario desconocido'}</p>
                  <p><strong>Categoría:</strong> {getCategoryIcon(selectedVideo.category)} {getCategoryLabel(selectedVideo.category)}</p>
                  <p><strong>Fecha de publicación:</strong> {formatDate(selectedVideo.createdAt)}</p>
                </div>
                  
                {selectedVideo.flags && selectedVideo.flags.length > 0 && (
                  <div className="report-status">
                    <h4 className="info-section-title">
                      <FontAwesomeIcon icon={faExclamationTriangle} /> Reportes
                    </h4>
                    <p><strong>Cantidad de reportes:</strong> {selectedVideo.flags.length}</p>
                    <div className="report-reasons">
                      {selectedVideo.flags.map((flag, index) => (
                        <div key={index} className="report-reason">
                          <FontAwesomeIcon icon={faExclamationTriangle} className="report-icon" />
                          <span>{flag.reason}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="video-description">
                  <h4 className="info-section-title">Descripción:</h4>
                  <p>{selectedVideo.description || 'Sin descripción'}</p>
                </div>
              </div>
            ) : (
              <div className="no-selection">
                <FontAwesomeIcon icon={faVideo} className="empty-detail-icon" />
                <p>Selecciona un video para ver más detalles</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default ContentManagement;
