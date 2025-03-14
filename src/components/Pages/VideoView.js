import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faExclamationTriangle, faCheck, faBan } from '@fortawesome/free-solid-svg-icons';
import VideoCard from '../Video/VideoCard';
import { fetchWithErrorHandling } from '../../utils/apiUtils';
import { isValidVideoId, formatVideoError } from '../../utils/videoUtils';
import './VideoView.css';

function VideoView({ currentUser, onLike, onComment, onDelete }) {
  const { videoId } = useParams();
  const location = useLocation();
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reportInfo, setReportInfo] = useState(null);
  const [adminAction, setAdminAction] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Memoize isAdmin function to avoid recreating it on every render
  const isAdmin = useCallback(() => {
    // Verificar que tenemos el usuario y su email
    if (!currentUser || !currentUser.email) {
      console.log("No hay usuario autenticado o falta el email");
      return false;
    }
    
    // Email de admin hardcodeado para pruebas (sustituir por variable de entorno en producción)
    const adminEmail = process.env.REACT_APP_ADMIN_EMAIL || "admin@fut4e.com";
    console.log(`Verificando admin: User email=${currentUser.email}, Admin email=${adminEmail}`);
    
    return currentUser.email === adminEmail;
  }, [currentUser]);

  // Memoize fetchReportDetails function
  const fetchReportDetails = useCallback(async (reportId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/support/${reportId}`, {
        headers: {
          'x-auth-token': localStorage.getItem('token')
        }
      });

      if (!response.ok) {
        throw new Error('No se pudo cargar la información del reporte');
      }

      const data = await response.json();
      
      if (data && data.metadata && data.metadata.reportReason) {
        setReportInfo({
          reason: getReasonLabel(data.metadata.reportReason),
          details: data.message,
          reportId: reportId,
          status: data.status
        });
      }
    } catch (err) {
      console.error('Error al cargar información del reporte:', err);
    }
  }, []); // No dependencies needed for this function

  // Check if we're coming from a report
  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const reportId = query.get('reportId');

    if (reportId && isAdmin()) {
      // Fetch report details if we have a report ID
      fetchReportDetails(reportId);
    }
  }, [location, fetchReportDetails, isAdmin]);

  // Fetch the video data
  useEffect(() => {
    const fetchVideo = async () => {
      try {
        setLoading(true);
        console.log(`Attempting to fetch video with ID: ${videoId}`);
        
        // First check if server is accessible
        try {
          const healthCheck = await fetch('http://localhost:5000/api/health');
          console.log('API health check response:', healthCheck.ok ? 'OK' : 'Failed');
        } catch (healthErr) {
          console.error('API health check failed:', healthErr);
        }
        
        // Validate video ID format first
        if (!isValidVideoId(videoId)) {
          throw new Error('ID de video inválido. Por favor verifica la URL.');
        }
        
        // Fetch video with proper error handling
        const response = await fetchWithErrorHandling(
          `http://localhost:5000/api/videos/${videoId}`,
          {}, 
          8000 // Longer timeout for video data
        );
        
        console.log(`Video API response status: ${response.status}`);

        if (response.status === 404) {
          throw new Error('El video solicitado no existe o ha sido eliminado.');
        } else if (!response.ok) {
          throw new Error(`Error al cargar el video (${response.status}): ${response.statusText}`);
        }

        const data = await response.json();
        console.log('Video data received:', data ? 'Success' : 'Empty');
        setVideo(data);
        setError(null);
      } catch (err) {
        console.error('Error al cargar el video:', err);
        setError(formatVideoError(err, videoId));
        setVideo(null);
      } finally {
        setLoading(false);
      }
    };

    if (videoId) {
      fetchVideo();
    } else {
      setError('No se proporcionó ID de video');
      setLoading(false);
    }
  }, [videoId]);

  const getReasonLabel = (reasonCode) => {
    const reasons = {
      'inappropriate': 'Contenido inapropiado',
      'copyright': 'Infracción de derechos de autor',
      'violent': 'Contenido violento',
      'harassment': 'Acoso o intimidación',
      'misinformation': 'Información falsa',
      'other': 'Otros motivos'
    };
    
    return reasons[reasonCode] || reasonCode;
  };

  const handleAdminAction = async (action) => {
    if (!reportInfo || !isAdmin()) return;

    setActionLoading(true);
    setAdminAction(null);

    try {
      if (action === 'approve') {
        // Mark report as resolved
        await updateReportStatus(reportInfo.reportId, 'resolved');
        setAdminAction({ type: 'success', message: 'Video aprobado y reporte resuelto' });
      } else if (action === 'remove') {
        // Delete video and mark report as resolved
        try {
          await deleteVideo();
          await updateReportStatus(reportInfo.reportId, 'resolved');
          setAdminAction({ type: 'success', message: 'Video eliminado y reporte resuelto' });
        } catch (deleteErr) {
          console.error('Error específico al eliminar video:', deleteErr);
          setAdminAction({ 
            type: 'error', 
            message: `Error al eliminar video: ${deleteErr.message}` 
          });
        }
      }
    } catch (err) {
      console.error('Error al procesar acción:', err);
      setAdminAction({ type: 'error', message: 'Error al procesar la acción' });
    } finally {
      setActionLoading(false);
    }
  };

  const updateReportStatus = async (reportId, status) => {
    const response = await fetch(`http://localhost:5000/api/support/${reportId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': localStorage.getItem('token')
      },
      body: JSON.stringify({ status })
    });

    if (!response.ok) {
      throw new Error('No se pudo actualizar el estado del reporte');
    }

    return await response.json();
  };

  const deleteVideo = async () => {
    try {
      console.log(`[VideoView] Solicitando eliminación del video ${videoId}`);
      
      // Llamar a la función central de eliminación
      if (!onDelete) {
        throw new Error('Función de eliminación no disponible');
      }
      
      // La función onDelete ya maneja la actualización del estado global
      await onDelete(videoId);
      
      console.log(`[VideoView] Video ${videoId} eliminado exitosamente`);
      
      // Actualizar el estado local inmediatamente
      setVideo(null);
      setError('Este video ha sido eliminado por un administrador.');
      
      // Programar redirección con tiempo suficiente para actualizar la UI
      setTimeout(() => {
        console.log("[VideoView] Redirigiendo a página principal tras eliminación");
        window.location.href = '/';
      }, 1500);
      
      return { success: true };
      
    } catch (err) {
      console.error('[VideoView] Error al eliminar el video:', err);
      setAdminAction({ 
        type: 'error', 
        message: `Error: ${err.message}` 
      });
      throw err;
    }
  };
  
  // Mejorar el efecto para manejar eventos de eliminación
  useEffect(() => {
    const handleVideoDeleted = (event) => {
      const { videoId: deletedVideoId, timestamp } = event.detail;
      
      if (deletedVideoId === videoId) {
        console.log(`[VideoView] Recibida notificación de eliminación para video actual ${videoId}`);
        
        // Actualizar UI inmediatamente
        setVideo(null);
        setError(`Este video ha sido eliminado (${new Date(timestamp).toLocaleTimeString()})`);
        
        // No redireccionar aquí - la función que inició la eliminación ya lo manejará
      }
    };
    
    window.addEventListener('videoDeleteSuccess', handleVideoDeleted);
    return () => {
      window.removeEventListener('videoDeleteSuccess', handleVideoDeleted);
    };
  }, [videoId]);

  return (
    <div className="video-view-container">
      <div className="video-view-header">
        <Link to={reportInfo ? '/admin' : '/'} className="back-button">
          <FontAwesomeIcon icon={faArrowLeft} /> Volver
        </Link>
        <h2>Visualización de Video</h2>
      </div>

      {isAdmin() && reportInfo && (
        <div className="report-banner">
          <div className="report-icon">
            <FontAwesomeIcon icon={faExclamationTriangle} />
          </div>
          <div className="report-info">
            <h3>Video Reportado</h3>
            <p><strong>Motivo:</strong> {reportInfo.reason}</p>
            {reportInfo.details && (
              <p><strong>Detalles:</strong> {reportInfo.details.replace(/^Razón: .*\n/, '').replace('Detalles adicionales: ', '')}</p>
            )}
            <p><strong>Estado:</strong> 
              <span className={`report-status ${reportInfo.status}`}>
                {reportInfo.status === 'pending' && 'Pendiente'}
                {reportInfo.status === 'in-progress' && 'En proceso'}
                {reportInfo.status === 'resolved' && 'Resuelto'}
              </span>
            </p>
          </div>
          
          {reportInfo.status !== 'resolved' && (
            <div className="admin-actions">
              <button 
                className="admin-action approve"
                onClick={() => handleAdminAction('approve')}
                disabled={actionLoading}
              >
                <FontAwesomeIcon icon={faCheck} /> Aprobar video
              </button>
              <button 
                className="admin-action remove"
                onClick={() => handleAdminAction('remove')}
                disabled={actionLoading}
              >
                <FontAwesomeIcon icon={faBan} /> Eliminar video
              </button>
            </div>
          )}
          
          {adminAction && (
            <div className={`action-message ${adminAction.type}`}>
              {adminAction.message}
            </div>
          )}
        </div>
      )}

      <div className="video-view-content">
        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Cargando video ID: {videoId}...</p>
          </div>
        ) : error ? (
          <div className="error-container">
            <p>{error}</p>
            <button 
              className="retry-button" 
              onClick={() => window.location.reload()}
            >
              Intentar de nuevo
            </button>
          </div>
        ) : video ? (
          <div className="video-container">
            <VideoCard 
              video={video}
              currentUser={currentUser}
              onLike={onLike}
              onComment={onComment}
              onDelete={onDelete}
              showReport={!reportInfo} // Don't show report button if already reported
            />
          </div>
        ) : (
          <div className="error-container">Video no encontrado</div>
        )}
      </div>
    </div>
  );
}

export default VideoView;
