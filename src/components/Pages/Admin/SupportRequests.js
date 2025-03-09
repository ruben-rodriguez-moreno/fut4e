import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faSpinner, faCheck, faTrashAlt, faFilter, faFlag, faEnvelope, faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';
import './SupportRequests.css';
import { API_BASE_URL } from '../../../utils/apiConfig';

function SupportRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [selectedRequest, setSelectedRequest] = useState(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/support`, {
        headers: {
          'x-auth-token': localStorage.getItem('token')
        }
      });

      if (!response.ok) {
        throw new Error('No se pudieron cargar las solicitudes de soporte');
      }

      const data = await response.json();
      setRequests(data);
      setError(null);
    } catch (err) {
      console.error('Error al cargar solicitudes:', err);
      setError(err.message || 'Error al cargar solicitudes de soporte');
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  const updateRequestStatus = async (id, newStatus) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/support/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': localStorage.getItem('token')
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) {
        throw new Error('No se pudo actualizar el estado');
      }

      const updatedRequest = await response.json();
      
      setRequests(requests.map(req => 
        req._id === id ? updatedRequest : req
      ));
      
      if (selectedRequest && selectedRequest._id === id) {
        setSelectedRequest(updatedRequest);
      }
    } catch (err) {
      console.error('Error al actualizar estado:', err);
      alert('Error al actualizar el estado: ' + err.message);
    }
  };

  const deleteRequest = async (id) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar esta solicitud?')) {
      return;
    }
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/support/${id}`, {
        method: 'DELETE',
        headers: {
          'x-auth-token': localStorage.getItem('token')
        }
      });

      if (!response.ok) {
        throw new Error('No se pudo eliminar la solicitud');
      }

      setRequests(requests.filter(req => req._id !== id));
      
      if (selectedRequest && selectedRequest._id === id) {
        setSelectedRequest(null);
      }
    } catch (err) {
      console.error('Error al eliminar solicitud:', err);
      alert('Error al eliminar la solicitud: ' + err.message);
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

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <FontAwesomeIcon icon={faClock} className="status-icon pending" />;
      case 'in-progress':
        return <FontAwesomeIcon icon={faSpinner} className="status-icon in-progress" />;
      case 'resolved':
        return <FontAwesomeIcon icon={faCheck} className="status-icon resolved" />;
      default:
        return null;
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'video-report':
        return <FontAwesomeIcon icon={faFlag} className="type-icon video-report" title="Reporte de video" />;
      default:
        return <FontAwesomeIcon icon={faEnvelope} className="type-icon support" title="Solicitud de soporte" />;
    }
  };

  // Filter requests by both status and type
  const filteredRequests = requests.filter(req => {
    // Filter by status
    const statusMatch = filter === 'all' || req.status === filter;
    
    // Filter by type
    const typeMatch = typeFilter === 'all' || 
                      (typeFilter === 'video-report' && req.type === 'video-report') ||
                      (typeFilter === 'support' && (!req.type || req.type !== 'video-report'));
    
    return statusMatch && typeMatch;
  });

  // Get the reason label from the code
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

  return (
    <div className="support-requests">
      <div className="admin-header">
        <h2>Solicitudes de Soporte</h2>
        <div className="filter-controls">
          {/* Status filter */}
          <div className="filter-group">
            <FontAwesomeIcon icon={faClock} className="filter-icon" />
            <select 
              value={filter} 
              onChange={(e) => setFilter(e.target.value)}
              className="status-filter"
            >
              <option value="all">Todos los estados</option>
              <option value="pending">Pendientes</option>
              <option value="in-progress">En Proceso</option>
              <option value="resolved">Resueltos</option>
            </select>
          </div>

          {/* Type filter */}
          <div className="filter-group">
            <FontAwesomeIcon icon={faFilter} className="filter-icon" />
            <select 
              value={typeFilter} 
              onChange={(e) => setTypeFilter(e.target.value)}
              className="type-filter"
            >
              <option value="all">Todos los tipos</option>
              <option value="support">Solicitudes de soporte</option>
              <option value="video-report">Reportes de videos</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="loading-container">Cargando solicitudes...</div>
      ) : error ? (
        <div className="error-container">{error}</div>
      ) : (
        <div className="support-content">
          <div className="requests-list">
            {filteredRequests.length > 0 ? filteredRequests.map(request => (
              <div 
                key={request._id} 
                className={`request-item ${selectedRequest && selectedRequest._id === request._id ? 'active' : ''}`}
                onClick={() => setSelectedRequest(request)}
              >
                <div className="request-header">
                  <div className="request-title-container">
                    {getTypeIcon(request.type)}
                    <h3 className="request-subject">{request.subject}</h3>
                  </div>
                  {getStatusIcon(request.status)}
                </div>
                <div className="request-meta">
                  <span className="request-author">{request.name}</span>
                  <span className="request-date">{formatDate(request.createdAt)}</span>
                </div>
              </div>
            )) : (
              <div className="no-requests">
                No hay solicitudes {filter !== 'all' ? `con estado "${filter}"` : ''} 
                {typeFilter !== 'all' ? ` del tipo "${typeFilter === 'video-report' ? 'reportes de videos' : 'solicitudes de soporte'}"` : ''}
              </div>
            )}
          </div>

          <div className="request-detail">
            {selectedRequest ? (
              <div className="detail-content">
                <div className="detail-header">
                  <h3>
                    {selectedRequest.type === 'video-report' && (
                      <span className="request-badge video-report">Reporte de Video</span>
                    )}
                    {selectedRequest.subject}
                  </h3>
                  <div className="status-controls">
                    <select 
                      value={selectedRequest.status}
                      onChange={(e) => updateRequestStatus(selectedRequest._id, e.target.value)}
                      className={`status-selector ${selectedRequest.status}`}
                    >
                      <option value="pending">Pendiente</option>
                      <option value="in-progress">En Proceso</option>
                      <option value="resolved">Resuelto</option>
                    </select>
                    <button 
                      onClick={() => deleteRequest(selectedRequest._id)} 
                      className="delete-button"
                      title="Eliminar solicitud"
                    >
                      <FontAwesomeIcon icon={faTrashAlt} />
                    </button>
                  </div>
                </div>

                <div className="detail-info">
                  <p><strong>De:</strong> {selectedRequest.name} ({selectedRequest.email})</p>
                  <p><strong>Recibido:</strong> {formatDate(selectedRequest.createdAt)}</p>
                  {selectedRequest.createdAt !== selectedRequest.updatedAt && (
                    <p><strong>Actualizado:</strong> {formatDate(selectedRequest.updatedAt)}</p>
                  )}
                  
                  {/* Additional information for video reports */}
                  {selectedRequest.type === 'video-report' && selectedRequest.metadata && (
                    <div className="video-report-details">
                      <p><strong>Video ID:</strong> {selectedRequest.metadata.videoId}</p>
                      <p><strong>Razón:</strong> {getReasonLabel(selectedRequest.metadata.reportReason)}</p>
                      <a 
                        href={`/video/${selectedRequest.metadata.videoId}?reportId=${selectedRequest._id}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="view-reported-video"
                      >
                        <FontAwesomeIcon icon={faExternalLinkAlt} /> Ver video reportado
                      </a>
                    </div>
                  )}
                </div>

                <div className="message-content">
                  <h4>Mensaje:</h4>
                  <p>{selectedRequest.message}</p>
                </div>
              </div>
            ) : (
              <div className="no-selection">
                <p>Selecciona una solicitud para ver más detalles</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default SupportRequests;
