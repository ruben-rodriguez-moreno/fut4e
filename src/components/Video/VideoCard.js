import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faComment, faFlag, faSpinner, faTrash, 
  faEllipsisV // Importamos el icono de tres puntos
} from '@fortawesome/free-solid-svg-icons';
import { faHeart as regularHeart } from '@fortawesome/free-regular-svg-icons';
import { faHeart as solidHeart } from '@fortawesome/free-solid-svg-icons';
import Comments from './Comments';
import './VideoCard.css';

function VideoCard({ video, currentUser, onLike, onComment, onDelete, showAuthor = true, showReport = true }) {
  const [showComments, setShowComments] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportData, setReportData] = useState({
    reason: '',
    details: '',
    name: currentUser?.username || '',
    email: currentUser?.email || ''
  });
  const [isReporting, setIsReporting] = useState(false);
  const [reportStatus, setReportStatus] = useState({ message: '', type: '' });
  // Nuevo estado para controlar la visibilidad del menú de opciones
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);

  const handleLike = () => {
    if (!currentUser) {
      // Disparar evento personalizado para mostrar el modal de login
      const authEvent = new CustomEvent('showAuth', { 
        detail: { isLogin: true } 
      });
      window.dispatchEvent(authEvent);
      return;
    }
    onLike(video._id);
  };

  const handleCommentsClick = () => {
    if (!currentUser) {
      // Disparar evento personalizado para mostrar el modal de login
      const authEvent = new CustomEvent('showAuth', { 
        detail: { isLogin: true } 
      });
      window.dispatchEvent(authEvent);
      return;
    }
    setShowComments(!showComments);
  };

  const handleDelete = async () => {
    setShowConfirmation(false);
    setIsDeleting(true);
    setDeleteError('');
    
    try {
      console.log(`[VideoCard] Solicitando eliminación del video ${video._id}`);
      
      // Llamar a la función central de eliminación y esperar su respuesta
      await onDelete(video._id);
      
      console.log(`[VideoCard] Video ${video._id} eliminado exitosamente`);
      
      // Ya no necesitamos hacer otra llamada a la API aquí
      // La función onDelete ya se encargó de todo
      
      // Si estamos en la página de visualización, programar una redirección
      if (window.location.pathname.includes(`/video/${video._id}`)) {
        console.log("[VideoCard] Preparando redirección desde página del video eliminado");
        setTimeout(() => {
          window.location.href = '/';
        }, 800);  // Dar tiempo para que se actualice el estado global
      }
      
    } catch (err) {
      console.error('[VideoCard] Error al eliminar:', err);
      setDeleteError(err.message || 'No se pudo eliminar el video');
      setTimeout(() => setDeleteError(''), 3000);
    } finally {
      setIsDeleting(false);
    }
  };
  
  // Añadir efecto para escuchar eventos de eliminación
  useEffect(() => {
    const handleDeleteSuccess = (event) => {
      const { videoId } = event.detail;
      if (video._id === videoId) {
        console.log(`[VideoCard] Recibida notificación de eliminación exitosa para video ${videoId}`);
        setIsDeleting(false);
      }
    };
    
    const handleDeleteError = (event) => {
      const { videoId, error } = event.detail;
      if (video._id === videoId) {
        console.log(`[VideoCard] Recibida notificación de error en eliminación para video ${videoId}`);
        setDeleteError(error);
        setIsDeleting(false);
        setTimeout(() => setDeleteError(''), 3000);
      }
    };
    
    window.addEventListener('videoDeleteSuccess', handleDeleteSuccess);
    window.addEventListener('videoDeleteError', handleDeleteError);
    
    return () => {
      window.removeEventListener('videoDeleteSuccess', handleDeleteSuccess);
      window.removeEventListener('videoDeleteError', handleDeleteError);
    };
  }, [video._id]);

  const handleReportSubmit = async (e) => {
    e.preventDefault();
    
    if (!reportData.reason) {
      setReportStatus({ message: 'Por favor selecciona una razón para el reporte', type: 'error' });
      return;
    }
    
    setIsReporting(true);
    setReportStatus({ message: '', type: '' });
    
    try {
      const response = await fetch('https://fut4e.onrender.com/api/support/report-video', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(currentUser && { 'x-auth-token': localStorage.getItem('token') })
        },
        body: JSON.stringify({
          videoId: video._id,
          ...reportData
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Error al enviar el reporte');
      }
      
      setReportStatus({ message: 'Reporte enviado correctamente. Gracias por ayudarnos.', type: 'success' });
      
      // Cerrar el modal después de 2 segundos
      setTimeout(() => {
        setShowReportModal(false);
        setReportData({
          reason: '',
          details: '',
          name: currentUser?.username || '',
          email: currentUser?.email || ''
        });
      }, 2000);
      
    } catch (err) {
      setReportStatus({ message: err.message || 'Error al enviar el reporte', type: 'error' });
    } finally {
      setIsReporting(false);
    }
  };

  const isCreator = currentUser?._id === video.author?._id;
  const isLiked = currentUser && video.likes.some(like => like._id === currentUser._id);

  return (
    <>
      <div className={`video-card ${showComments ? 'with-active-comments' : ''}`}>
        {/* Agregar botón de opciones en la esquina superior derecha */}
        {showReport && (
          <div className="video-options">
            <button 
              onClick={() => setShowOptionsMenu(!showOptionsMenu)} 
              className="options-button"
              aria-label="Opciones de video"
            >
              <FontAwesomeIcon icon={faEllipsisV} />
            </button>
            
            {/* Menú desplegable de opciones */}
            {showOptionsMenu && (
              <div className="options-menu">
                <button 
                  onClick={() => {
                    setShowOptionsMenu(false);
                    setShowReportModal(true);
                  }}
                  className="option-item"
                >
                  <FontAwesomeIcon icon={faFlag} /> Reportar
                </button>
              </div>
            )}
          </div>
        )}
        
        <video src={`https://fut4e.onrender.com${video.url}`} controls />
        <div className="video-info">
          <div className="video-header">
            <h3>{video.title}</h3>
            {isCreator && (
              <div className="delete-container">
                {deleteError && (
                  <span className="delete-error">{deleteError}</span>
                )}
                <button 
                  onClick={() => setShowConfirmation(true)}
                  className="delete-btn"
                  disabled={isDeleting}
                  aria-label="Eliminar video"
                >
                  {isDeleting ? (
                    <FontAwesomeIcon icon={faSpinner} spin />
                  ) : (
                    <FontAwesomeIcon icon={faTrash} />
                  )}
                </button>
              </div>
            )}
          </div>
          {showAuthor !== false && video.author && (
            <p className="video-author">
              Por <Link 
                to={`/perfil/${encodeURIComponent(video.author.username)}`} 
                className="author-link"
                onClick={(e) => {
                  // Validar que el autor tiene un nombre de usuario válido
                  if (!video.author.username || video.author.username.trim() === '') {
                    e.preventDefault();
                    alert('Información de autor no disponible');
                    return;
                  }
                  
                  // Si queremos pre-verificar que el usuario existe antes de navegar
                  // Comentado porque puede generar muchas llamadas API
                  /* 
                  e.preventDefault();
                  const cleanUsername = video.author.username.trim();
                  fetch(`https://fut4e.onrender.com/api/auth/username/${encodeURIComponent(cleanUsername)}`)
                    .then(response => {
                      if (response.ok) {
                        window.location.href = `/perfil/${encodeURIComponent(cleanUsername)}`;
                      } else {
                        alert('No se pudo cargar el perfil del autor');
                      }
                    })
                    .catch(err => {
                      console.error("Error verificando autor:", err);
                    });
                  */
                }}
              >
                {video.author.username || 'Usuario desconocido'}
              </Link>
            </p>
          )}
          <div className="video-actions">
            <button 
              onClick={handleLike} 
              className={`like-button ${isLiked ? 'liked' : ''}`}
              aria-label={isLiked ? "Quitar me gusta" : "Me gusta"}
            >
              <FontAwesomeIcon 
                icon={isLiked ? solidHeart : regularHeart} 
                className="like-icon" 
              />
              {video.likes.length} {video.likes.length === 1 ? 'Me gusta' : 'Me gusta'}
            </button>
            <button 
              onClick={handleCommentsClick} 
              className={showComments ? 'active' : ''}
            >
              <FontAwesomeIcon icon={faComment} />
              {video.comments.length} {video.comments.length === 1 ? 'Comentario' : 'Comentarios'}
            </button>
            {/* El botón de reportar ya no está aquí, se movió al menú de opciones */}
          </div>
        </div>
        
        {/* Mostramos los comentarios dentro del card sin posición absoluta */}
        {showComments && (
          <div className="comments-container">
            <Comments
              videoId={video._id}
              comments={video.comments}
              onCommentAdd={(updatedVideo) => onComment(video._id, updatedVideo)}
              isLoggedIn={!!currentUser}
            />
          </div>
        )}
      </div>

      {showConfirmation && (
        <div className="confirmation-dialog">
          <div className="confirmation-content">
            <h3>Eliminar Video</h3>
            <p>¿Estás seguro de que deseas eliminar este video?</p>
            <p className="warning-text">Esta acción no se puede deshacer.</p>
            <div className="confirmation-buttons">
              <button 
                className="cancel-btn"
                onClick={() => setShowConfirmation(false)}
              >
                Cancelar
              </button>
              <button 
                className="confirm-delete-btn"
                onClick={handleDelete}
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {showReportModal && (
        <div className="modal-overlay">
          <div className="report-modal">
            <h3>Reportar Video</h3>
            <p className="report-description">Por favor indícanos por qué quieres reportar este video</p>
            
            {reportStatus.message && (
              <div className={`report-status ${reportStatus.type}`}>
                {reportStatus.message}
              </div>
            )}
            
            <form onSubmit={handleReportSubmit}>
              <div className="form-group">
                <label htmlFor="report-reason">Razón del reporte</label>
                <select 
                  id="report-reason" 
                  value={reportData.reason}
                  onChange={(e) => setReportData({...reportData, reason: e.target.value})}
                  required
                >
                  <option value="">Selecciona una razón</option>
                  <option value="inappropriate">Contenido inapropiado</option>
                  <option value="copyright">Infracción de derechos de autor</option>
                  <option value="violent">Contenido violento</option>
                  <option value="harassment">Acoso o intimidación</option>
                  <option value="misinformation">Información falsa</option>
                  <option value="other">Otros motivos</option>
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="report-details">Detalles adicionales (opcional)</label>
                <textarea
                  id="report-details"
                  value={reportData.details}
                  onChange={(e) => setReportData({...reportData, details: e.target.value})}
                  placeholder="Proporciona más información sobre tu reporte"
                  rows="4"
                ></textarea>
              </div>
              
              {!currentUser && (
                <>
                  <div className="form-group">
                    <label htmlFor="report-name">Tu nombre (opcional)</label>
                    <input
                      type="text"
                      id="report-name"
                      value={reportData.name}
                      onChange={(e) => setReportData({...reportData, name: e.target.value})}
                      placeholder="Anónimo"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="report-email">Tu email (opcional)</label>
                    <input
                      type="email"
                      id="report-email"
                      value={reportData.email}
                      onChange={(e) => setReportData({...reportData, email: e.target.value})}
                      placeholder="Para recibir actualizaciones sobre tu reporte"
                    />
                  </div>
                </>
              )}
              
              <div className="report-actions">
                <button 
                  type="button" 
                  onClick={() => setShowReportModal(false)} 
                  className="cancel-button"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="submit-report-button" 
                  disabled={isReporting}
                >
                  {isReporting ? 'Enviando...' : 'Enviar reporte'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default VideoCard;