import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import SupportRequests from './SupportRequests';
import './AdminDashboard.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeadset, faUsers, faVideo, faChartLine } from '@fortawesome/free-solid-svg-icons';

function AdminDashboard({ currentUser }) {
  const [activeTab, setActiveTab] = useState('support');
  
  // Comprobar si el usuario es administrador
  const isAdmin = currentUser && currentUser.email === 'fut4ebusiness@gmail.com';
  
  if (!currentUser) {
    return <Navigate to="/" replace />;
  }
  
  if (!isAdmin) {
    return (
      <div className="admin-access-denied">
        <h2>Acceso Restringido</h2>
        <p>Lo sentimos, solo el administrador puede acceder a esta página.</p>
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
            <li className="disabled">
              <FontAwesomeIcon icon={faUsers} className="nav-icon" />
              Gestión de Usuarios
            </li>
            <li className="disabled">
              <FontAwesomeIcon icon={faVideo} className="nav-icon" />
              Gestión de Contenido
            </li>
            <li className="disabled">
              <FontAwesomeIcon icon={faChartLine} className="nav-icon" />
              Estadísticas
            </li>
          </ul>
          
          <div className="admin-account-info">
            <span className="admin-label">Administrador</span>
            <div className="admin-user-info">
              <img 
                src={currentUser.profilePicture || '/default-profile.png'} 
                alt="Admin" 
                className="admin-avatar"
                onError={(e) => { e.target.src = '/default-profile.png'; }}
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
          {activeTab === 'users' && <div className="coming-soon">Gestión de usuarios - Próximamente</div>}
          {activeTab === 'content' && <div className="coming-soon">Gestión de contenido - Próximamente</div>}
          {activeTab === 'stats' && <div className="coming-soon">Estadísticas - Próximamente</div>}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
