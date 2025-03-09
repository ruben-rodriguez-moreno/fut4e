import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../../../utils/apiConfig';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSearch, faFilter, faTrashAlt, faUser, 
  faUserShield, faUserSlash, faCheckCircle,
  faSortAmountDown, faSortAmountUp, faEdit
} from '@fortawesome/free-solid-svg-icons';
import { getFullImageUrl } from '../../../utils/imageUtils';
import './AdminDashboard.css';

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [sortOrder, setSortOrder] = useState('newest');
  const [confirmAction, setConfirmAction] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/auth/users`, {
        headers: {
          'x-auth-token': localStorage.getItem('token')
        }
      });

      if (!response.ok) {
        throw new Error('No se pudieron cargar los usuarios');
      }

      const data = await response.json();
      setUsers(data);
      setError(null);
    } catch (err) {
      console.error('Error al cargar usuarios:', err);
      setError(err.message || 'Error al obtener la lista de usuarios');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const updateUserStatus = async (userId, newStatus) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/users/${userId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': localStorage.getItem('token')
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) {
        throw new Error('No se pudo actualizar el estado del usuario');
      }

      const updatedUser = await response.json();
      
      setUsers(users.map(user => 
        user._id === userId ? updatedUser : user
      ));
      
      if (selectedUser && selectedUser._id === userId) {
        setSelectedUser(updatedUser);
      }

      setConfirmAction({
        type: 'success',
        message: `Usuario ${newStatus === 'blocked' ? 'bloqueado' : 'activado'} exitosamente`
      });

      setTimeout(() => setConfirmAction(null), 3000);
    } catch (err) {
      console.error('Error al actualizar estado:', err);
      setConfirmAction({
        type: 'error',
        message: `Error: ${err.message}`
      });
      setTimeout(() => setConfirmAction(null), 3000);
    }
  };

  const deleteUser = async (userId) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este usuario? Esta acción no se puede deshacer y eliminará todos sus datos incluyendo videos.')) {
      return;
    }
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'x-auth-token': localStorage.getItem('token')
        }
      });

      if (!response.ok) {
        throw new Error('No se pudo eliminar el usuario');
      }

      setUsers(users.filter(user => user._id !== userId));
      
      if (selectedUser && selectedUser._id === userId) {
        setSelectedUser(null);
      }

      setConfirmAction({
        type: 'success',
        message: 'Usuario eliminado exitosamente'
      });

      setTimeout(() => setConfirmAction(null), 3000);
    } catch (err) {
      console.error('Error al eliminar usuario:', err);
      setConfirmAction({
        type: 'error',
        message: `Error: ${err.message}`
      });
      setTimeout(() => setConfirmAction(null), 3000);
    }
  };

  const makeAdmin = async (userId) => {
    if (!window.confirm('¿Estás seguro de que quieres conceder permisos de administrador a este usuario?\n\nEsto permitirá al usuario acceder al panel de administración y gestionar usuarios y contenido.')) {
      return;
    }
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/users/${userId}/role`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': localStorage.getItem('token')
        },
        body: JSON.stringify({ role: 'admin' })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'No se pudo actualizar el rol del usuario');
      }

      const updatedUser = await response.json();
      
      setUsers(users.map(user => 
        user._id === userId ? updatedUser : user
      ));
      
      if (selectedUser && selectedUser._id === userId) {
        setSelectedUser(updatedUser);
      }

      setConfirmAction({
        type: 'success',
        message: 'Permisos de administrador concedidos exitosamente'
      });

      setTimeout(() => setConfirmAction(null), 3000);
    } catch (err) {
      console.error('Error al actualizar rol:', err);
      setConfirmAction({
        type: 'error',
        message: `Error: ${err.message}`
      });
      setTimeout(() => setConfirmAction(null), 3000);
    }
  };
  
  const removeAdmin = async (userId) => {
    if (!window.confirm('¿Estás seguro de que quieres revocar los permisos de administrador de este usuario?\n\nEsto impedirá que el usuario acceda al panel de administración.')) {
      return;
    }
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/users/${userId}/role`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': localStorage.getItem('token')
        },
        body: JSON.stringify({ role: 'user' })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'No se pudo actualizar el rol del usuario');
      }

      const updatedUser = await response.json();
      
      setUsers(users.map(user => 
        user._id === userId ? updatedUser : user
      ));
      
      if (selectedUser && selectedUser._id === userId) {
        setSelectedUser(updatedUser);
      }

      setConfirmAction({
        type: 'success',
        message: 'Permisos de administrador revocados exitosamente'
      });

      setTimeout(() => setConfirmAction(null), 3000);
    } catch (err) {
      console.error('Error al actualizar rol:', err);
      setConfirmAction({
        type: 'error',
        message: `Error: ${err.message}`
      });
      setTimeout(() => setConfirmAction(null), 3000);
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

  const handleSearch = (e) => {
    e.preventDefault();
    // La búsqueda se realiza en el cliente, filtrando los usuarios ya cargados
    // En una aplicación real, podríamos enviar la consulta al backend
  };

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'newest' ? 'oldest' : 'newest');
  };

  // Filtrar y ordenar usuarios
  const filteredUsers = users
    .filter(user => {
      // Filtro por estado
      if (filter === 'all') return true;
      if (filter === 'active') return user.status !== 'blocked';
      if (filter === 'blocked') return user.status === 'blocked';
      if (filter === 'admin') return user.role === 'admin';
      return true;
    })
    .filter(user => {
      // Filtro por búsqueda
      if (!searchQuery) return true;
      const query = searchQuery.toLowerCase();
      return (
        user.username.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        (user.description && user.description.toLowerCase().includes(query))
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

  return (
    <div className="user-management">
      <div className="admin-header">
        <h2>Gestión de Usuarios</h2>
        <div className="filter-controls">
          {/* Status filter */}
          <div className="filter-group">
            <FontAwesomeIcon icon={faFilter} className="filter-icon" />
            <select 
              value={filter} 
              onChange={(e) => setFilter(e.target.value)}
              className="status-filter"
            >
              <option value="all">Todos los usuarios</option>
              <option value="active">Activos</option>
              <option value="blocked">Bloqueados</option>
              <option value="admin">Administradores</option>
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
      <form onSubmit={handleSearch} className="user-search-form">
        <div className="search-input-container">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por nombre o email..."
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
          {confirmAction.message}
        </div>
      )}

      {loading ? (
        <div className="loading-container">Cargando usuarios...</div>
      ) : error ? (
        <div className="error-container">{error}</div>
      ) : (
        <div className="users-content">
          <div className="users-list">
            {filteredUsers.length > 0 ? filteredUsers.map(user => (
              <div 
                key={user._id} 
                className={`user-item ${selectedUser && selectedUser._id === user._id ? 'active' : ''} ${user.status === 'blocked' ? 'user-blocked' : ''}`}
                onClick={() => setSelectedUser(user)}
              >
                <div className="user-header">
                  <div className="user-avatar-container">
                    <img 
                      src={getFullImageUrl(user.profilePicture)} 
                      alt={user.username}
                      className="user-avatar"
                      onError={(e) => { e.target.src = '/default-profile.png'; }}
                    />
                  </div>
                  <div className="user-title-container">
                    <h3 className="user-name">
                      {user.username}
                      {user.role === 'admin' && (
                        <span className="admin-badge" title="Administrador">
                          <FontAwesomeIcon icon={faUserShield} />
                        </span>
                      )}
                    </h3>
                    <span className="user-email">{user.email}</span>
                  </div>
                </div>
                <div className="user-meta">
                  <span className="user-date">{formatDate(user.createdAt)}</span>
                  {user.status === 'blocked' && (
                    <span className="user-status blocked">Bloqueado</span>
                  )}
                </div>
              </div>
            )) : (
              <div className="no-users">
                No hay usuarios {filter !== 'all' ? `con estado "${filter}"` : ''} 
                {searchQuery && ` que coincidan con "${searchQuery}"`}
              </div>
            )}
          </div>

          <div className="user-detail">
            {selectedUser ? (
              <div className="detail-content">
                <div className="detail-header">
                  <h3>{selectedUser.username}</h3>
                  <div className="action-controls">
                    {selectedUser.status !== 'blocked' ? (
                      <button 
                        onClick={() => updateUserStatus(selectedUser._id, 'blocked')} 
                        className="block-button"
                        title="Bloquear usuario"
                      >
                        <FontAwesomeIcon icon={faUserSlash} />
                      </button>
                    ) : (
                      <button 
                        onClick={() => updateUserStatus(selectedUser._id, 'active')} 
                        className="activate-button"
                        title="Activar usuario"
                      >
                        <FontAwesomeIcon icon={faCheckCircle} />
                      </button>
                    )}

                    {selectedUser.role === 'admin' ? (
                      <button 
                        onClick={() => removeAdmin(selectedUser._id)} 
                        className="remove-admin-button"
                        title="Quitar permisos de administrador"
                      >
                        <FontAwesomeIcon icon={faUserShield} style={{ opacity: 0.7 }} />
                      </button>
                    ) : (
                      <button 
                        onClick={() => makeAdmin(selectedUser._id)} 
                        className="admin-button"
                        title="Hacer administrador"
                      >
                        <FontAwesomeIcon icon={faUserShield} />
                      </button>
                    )}

                    <button 
                      onClick={() => deleteUser(selectedUser._id)} 
                      className="delete-button"
                      title="Eliminar usuario"
                    >
                      <FontAwesomeIcon icon={faTrashAlt} />
                    </button>
                  </div>
                </div>

                <div className="detail-info">
                  <div className="user-profile-preview">
                    <img 
                      src={getFullImageUrl(selectedUser.profilePicture)} 
                      alt={selectedUser.username}
                      className="profile-image"
                      onError={(e) => { e.target.src = '/default-profile.png'; }}
                    />
                  </div>

                  <div className="user-details">
                    <p><strong>Email:</strong> {selectedUser.email}</p>
                    <p><strong>Fecha de registro:</strong> {formatDate(selectedUser.createdAt)}</p>
                    <p><strong>Estado:</strong> 
                      <span className={`status-indicator ${selectedUser.status === 'blocked' ? 'blocked' : 'active'}`}>
                        {selectedUser.status === 'blocked' ? 'Bloqueado' : 'Activo'}
                      </span>
                    </p>
                    <p><strong>Rol:</strong> {selectedUser.role === 'admin' ? 'Administrador' : 'Usuario'}</p>
                  </div>

                  <div className="user-bio">
                    <h4>Descripción:</h4>
                    <p>{selectedUser.description || 'Sin descripción'}</p>
                  </div>

                  <div className="user-actions">
                    <a 
                      href={`/perfil/${selectedUser.username}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="view-profile"
                    >
                      <FontAwesomeIcon icon={faUser} /> Ver perfil público
                    </a>
                  </div>
                </div>
              </div>
            ) : (
              <div className="no-selection">
                <p>Selecciona un usuario para ver más detalles</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default UserManagement;
