import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import SupportRequests from './SupportRequests';
import UserManagement from './UserManagement';
import ContentManagement from './ContentManagement';
import Statistics from './Statistics';  // Importar el nuevo componente
import './AdminDashboard.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeadset, faUsers, faVideo, faChartLine } from '@fortawesome/free-solid-svg-icons';
import { getFullImageUrl } from '../../../utils/imageUtils';
import { API_BASE_URL } from '../../../utils/apiConfig';

function AdminDashboard({ currentUser }) {
  const [activeTab, setActiveTab] = useState('support');
  
  // Comprobar si el usuario es administrador por su rol en lugar de por su email
  const isAdmin = currentUser && currentUser.role === 'admin';
  
  if (!currentUser) {
    return <Navigate to="/" replace />;
  }
  
  if (!isAdmin) {
    return (
      <div className="admin-access-denied">
        <h2>Acceso Restringido</h2>
        <p>Lo sentimos, solo los administradores pueden acceder a esta página.</p>
        <button onClick={() => window.history.back()}>Volver</button>
      </div>
    );
  }
  
  return (
    <div className="admin-dashboard">
      <h1 className="admin-title">Panel Administrativo</h1>
      
      <div className="admin-container">
        <div className="admin-sidebar">
          <h3>Navegación</h3>
          <ul className="admin-nav">
            <li 
              className={activeTab === 'support' ? 'active' : ''} 
              onClick={() => setActiveTab('support')}
            >
              <FontAwesomeIcon icon={faHeadset} className="nav-icon" />
              Solicitudes de Soporte
            </li>
            <li 
              className={activeTab === 'users' ? 'active' : ''}
              onClick={() => setActiveTab('users')}
            >
              <FontAwesomeIcon icon={faUsers} className="nav-icon" />
              Gestión de Usuarios
            </li>
            <li 
              className={activeTab === 'content' ? 'active' : ''}
              onClick={() => setActiveTab('content')}
            >
              <FontAwesomeIcon icon={faVideo} className="nav-icon" />
              Gestión de Contenido
            </li>
            <li 
              className={activeTab === 'stats' ? 'active' : ''}
              onClick={() => setActiveTab('stats')}
            >
              <FontAwesomeIcon icon={faChartLine} className="nav-icon" />
              Estadísticas
            </li>
          </ul>
          
          <div className="admin-account-info">
            <span className="admin-label">Administrador</span>
            <div className="admin-user-info">
              <img 
                src={getFullImageUrl(currentUser.profilePicture)} 
                alt="Admin" 
                className="admin-avatar"
                onError={(e) => { e.target.src = `${API_BASE_URL}/default-profile.png`; }}
              />
              <div>
                <p className="admin-name">{currentUser.username}</p>
                <p className="admin-email">{currentUser.email}</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="admin-content">
          {activeTab === 'support' && <SupportRequests />}
          {activeTab === 'users' && <UserManagement />}
          {activeTab === 'content' && <ContentManagement />}
          {activeTab === 'stats' && <Statistics />}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
