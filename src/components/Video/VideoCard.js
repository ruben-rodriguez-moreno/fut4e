import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Comments from './Comments';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faComment, faTrash, faSpinner, faFlag } from '@fortawesome/free-solid-svg-icons';
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

  const handleLike = () => {
    onLike(video._id);
  };

  const handleDelete = async () => {
    setShowConfirmation(false);
    setIsDeleting(true);
    setDeleteError('');
    
    try {
      const response = await fetch(`http://localhost:5000/api/videos/${video._id}`, {
        method: 'DELETE',
        headers: {
          'x-auth-token': localStorage.getItem('token'),
          'Accept': 'application/json'
        }
      });

      // Check if response is JSON
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Server returned non-JSON response");
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete video');
      }

      if (data.success) {
        onDelete(video._id);
      } else {
        throw new Error(data.error || 'Failed to delete video');
      }
    } catch (err) {
      console.error('Delete error:', err);
      setDeleteError(err.message || 'Failed to delete video');
      setTimeout(() => setDeleteError(''), 3000);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleReportSubmit = async (e) => {
    e.preventDefault();
    
    if (!reportData.reason) {
      setReportStatus({ message: 'Por favor selecciona una razón para el reporte', type: 'error' });
      return;
    }
    
    setIsReporting(true);
    setReportStatus({ message: '', type: '' });
    
    try {
      const response = await fetch('http://localhost:5000/api/support/report-video', {
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
      <div className="video-card">
        <video src={`http://localhost:5000${video.url}`} controls />
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
                  aria-label="Delete video"
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
                  fetch(`http://localhost:5000/api/auth/username/${encodeURIComponent(cleanUsername)}`)
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
              className={!currentUser ? 'action-button disabled' : `action-button ${isLiked ? 'liked' : ''}`}
            >
              <FontAwesomeIcon icon={faHeart} className={isLiked ? 'liked-icon' : ''} />
              {video.likes.length} {video.likes.length === 1 ? 'Like' : 'Likes'}
            </button>
            <button onClick={() => setShowComments(!showComments)}>
              <FontAwesomeIcon icon={faComment} />
              {video.comments.length} {video.comments.length === 1 ? 'Comment' : 'Comments'}
            </button>
            {showReport && (
              <button 
                onClick={() => setShowReportModal(true)} 
                className="report-button"
                aria-label="Reportar video"
              >
                <FontAwesomeIcon icon={faFlag} />
                Reportar
              </button>
            )}
          </div>
          {showComments && (
            <Comments
              videoId={video._id}
              comments={video.comments}
              onCommentAdd={(updatedVideo) => onComment(video._id, updatedVideo)}
              isLoggedIn={!!currentUser}
            />
          )}
        </div>
      </div>

      {showConfirmation && (
        <div className="confirmation-dialog">
          <div className="confirmation-content">
            <h3>Delete Video</h3>
            <p>Are you sure you want to delete this video?</p>
            <p className="warning-text">This action cannot be undone.</p>
            <div className="confirmation-buttons">
              <button 
                className="cancel-btn"
                onClick={() => setShowConfirmation(false)}
              >
                Cancel
              </button>
              <button 
                className="confirm-delete-btn"
                onClick={handleDelete}
              >
                Delete
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