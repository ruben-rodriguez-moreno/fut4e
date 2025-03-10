import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faChartLine, faUserPlus, faVideo, faThumbsUp, 
  faComment, faCalendarAlt, faFilter, faSyncAlt
} from '@fortawesome/free-solid-svg-icons';
import { API_BASE_URL } from '../../../utils/apiConfig';
import './AdminDashboard.css';

function Statistics() {
  const [stats, setStats] = useState({
    userStats: null,
    videoStats: null,
    interactionStats: null
  });
  const [timeRange, setTimeRange] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Función para cargar estadísticas
  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Estadísticas de usuarios
      const userResponse = await fetch(`${API_BASE_URL}/api/stats/users?timeRange=${timeRange}`, {
        headers: {
          'x-auth-token': localStorage.getItem('token')
        }
      });
      
      // Estadísticas de videos
      const videoResponse = await fetch(`${API_BASE_URL}/api/stats/videos?timeRange=${timeRange}`, {
        headers: {
          'x-auth-token': localStorage.getItem('token')
        }
      });
      
      // Estadísticas de interacciones
      const interactionResponse = await fetch(`${API_BASE_URL}/api/stats/interactions?timeRange=${timeRange}`, {
        headers: {
          'x-auth-token': localStorage.getItem('token')
        }
      });
      
      // Procesar respuestas
      if (!userResponse.ok || !videoResponse.ok || !interactionResponse.ok) {
        throw new Error('Error al cargar estadísticas');
      }
      
      const userData = await userResponse.json();
      const videoData = await videoResponse.json();
      const interactionData = await interactionResponse.json();
      
      setStats({
        userStats: userData,
        videoStats: videoData,
        interactionStats: interactionData
      });
      
    } catch (err) {
      console.error('Error al cargar estadísticas:', err);
      setError(err.message || 'Error al cargar estadísticas');
    } finally {
      setLoading(false);
    }
  };

  // Cargar estadísticas al montar el componente o cambiar el rango de tiempo
  useEffect(() => {
    fetchStats();
  }, [timeRange]);

  // Función para renderizar estadísticas de desarrollo si la API no está disponible
  const renderDevelopmentStats = () => {
    // Datos de muestra para desarrollo
    const sampleStats = {
      userStats: {
        total: 145,
        active: 120,
        blocked: 5,
        adminCount: 3,
        newUsersThisWeek: 12,
        newUsersThisMonth: 37,
        growthRate: 8.2,
        registrationsByDay: [4, 2, 7, 3, 8, 5, 9]
      },
      videoStats: {
        total: 278,
        featured: 15,
        reported: 8,
        byCategory: {
          football: 156,
          skills: 84,
          highlights: 38
        },
        uploadsThisWeek: 24,
        uploadsThisMonth: 76
      },
      interactionStats: {
        totalLikes: 3240,
        totalComments: 845,
        averageLikesPerVideo: 11.65,
        averageCommentsPerVideo: 3.04,
        mostLikedVideo: {
          id: "vid123",
          title: "Gol espectacular de media cancha",
          likes: 87
        },
        mostCommentedVideo: {
          id: "vid456",
          title: "Mejores jugadas de la temporada",
          comments: 45
        },
        likesByDay: [120, 145, 132, 168, 152, 187, 211],
        commentsByDay: [34, 28, 41, 36, 39, 42, 47]
      }
    };
    
    return sampleStats;
  };

  // Obtener estadísticas (de desarrollo si es necesario)
  const getStats = () => {
    if (error || !stats.userStats) {
      return renderDevelopmentStats();
    }
    return stats;
  };

  const currentStats = getStats();

  return (
    <div className="statistics-container">
      <div className="admin-header">
        <div className="header-title">
          <h2>
            <FontAwesomeIcon icon={faChartLine} className="section-icon" /> 
            Estadísticas de la Plataforma
          </h2>
        </div>
        
        <div className="filter-controls">
          <div className="filter-group">
            <FontAwesomeIcon icon={faFilter} className="filter-icon" />
            <select 
              value={timeRange} 
              onChange={(e) => setTimeRange(e.target.value)}
              className="time-filter"
            >
              <option value="all">Todo el tiempo</option>
              <option value="week">Última semana</option>
              <option value="month">Último mes</option>
              <option value="year">Último año</option>
            </select>
          </div>
          
          <button 
            className="refresh-button"
            onClick={fetchStats}
            title="Actualizar estadísticas"
          >
            <FontAwesomeIcon icon={faSyncAlt} />
          </button>
        </div>
      </div>

      {loading && <div className="loading-container">Cargando estadísticas...</div>}
      
      {error && !loading && (
        <div className="stats-error">
          <p>{error}</p>
          <p className="dev-note">Mostrando datos de muestra para desarrollo</p>
        </div>
      )}

      <div className="stats-overview">
        <div className="stats-card users">
          <div className="stats-card-header">
            <h3><FontAwesomeIcon icon={faUserPlus} /> Usuarios</h3>
          </div>
          <div className="stats-card-content">
            <div className="stats-highlight">
              <span className="stats-number">{currentStats.userStats.total}</span>
              <span className="stats-label">Total de usuarios</span>
            </div>
            <div className="stats-details">
              <div className="stats-detail-item">
                <span className="detail-label">Activos:</span>
                <span className="detail-value">{currentStats.userStats.active}</span>
              </div>
              <div className="stats-detail-item">
                <span className="detail-label">Bloqueados:</span>
                <span className="detail-value">{currentStats.userStats.blocked}</span>
              </div>
              <div className="stats-detail-item">
                <span className="detail-label">Administradores:</span>
                <span className="detail-value">{currentStats.userStats.adminCount}</span>
              </div>
              <div className="stats-detail-item">
                <span className="detail-label">Nuevos esta semana:</span>
                <span className="detail-value">{currentStats.userStats.newUsersThisWeek}</span>
              </div>
            </div>
            <div className="stats-chart">
              <h4><FontAwesomeIcon icon={faCalendarAlt} /> Registros por día (última semana)</h4>
              <div className="bar-chart">
                {currentStats.userStats.registrationsByDay.map((value, index) => (
                  <div key={index} className="chart-bar-container">
                    <div 
                      className="chart-bar" 
                      style={{ 
                        height: `${(value / Math.max(...currentStats.userStats.registrationsByDay)) * 100}%` 
                      }}
                    >
                      <span className="chart-value">{value}</span>
                    </div>
                    <span className="chart-label">{['L', 'M', 'X', 'J', 'V', 'S', 'D'][index]}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="stats-card videos">
          <div className="stats-card-header">
            <h3><FontAwesomeIcon icon={faVideo} /> Videos</h3>
          </div>
          <div className="stats-card-content">
            <div className="stats-highlight">
              <span className="stats-number">{currentStats.videoStats.total}</span>
              <span className="stats-label">Total de videos</span>
            </div>
            <div className="stats-details">
              <div className="stats-detail-item">
                <span className="detail-label">Destacados:</span>
                <span className="detail-value">{currentStats.videoStats.featured}</span>
              </div>
              <div className="stats-detail-item">
                <span className="detail-label">Reportados:</span>
                <span className="detail-value">{currentStats.videoStats.reported}</span>
              </div>
              <div className="stats-detail-item">
                <span className="detail-label">Subidos esta semana:</span>
                <span className="detail-value">{currentStats.videoStats.uploadsThisWeek}</span>
              </div>
            </div>
            <div className="stats-pie-chart">
              <h4>Videos por categoría</h4>
              <div className="pie-chart">
                <div className="pie-container">
                  <div className="pie-segment football" style={{ 
                    '--percent': `${Math.round(currentStats.videoStats.byCategory.football / currentStats.videoStats.total * 100)}%` 
                  }}></div>
                  <div className="pie-segment skills" style={{ 
                    '--percent': `${Math.round(currentStats.videoStats.byCategory.skills / currentStats.videoStats.total * 100)}%` 
                  }}></div>
                  <div className="pie-segment highlights" style={{ 
                    '--percent': `${Math.round(currentStats.videoStats.byCategory.highlights / currentStats.videoStats.total * 100)}%` 
                  }}></div>
                </div>
                <div className="pie-legend">
                  <div className="legend-item">
                    <span className="legend-color football"></span>
                    <span>Fútbol ({currentStats.videoStats.byCategory.football})</span>
                  </div>
                  <div className="legend-item">
                    <span className="legend-color skills"></span>
                    <span>Habilidades ({currentStats.videoStats.byCategory.skills})</span>
                  </div>
                  <div className="legend-item">
                    <span className="legend-color highlights"></span>
                    <span>Destacados ({currentStats.videoStats.byCategory.highlights})</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="stats-card interactions">
          <div className="stats-card-header">
            <h3><FontAwesomeIcon icon={faThumbsUp} /> Interacciones</h3>
          </div>
          <div className="stats-card-content">
            <div className="stats-highlights-row">
              <div className="stats-highlight small">
                <span className="stats-number">{currentStats.interactionStats.totalLikes}</span>
                <span className="stats-label">Me gusta</span>
              </div>
              <div className="stats-highlight small">
                <span className="stats-number">{currentStats.interactionStats.totalComments}</span>
                <span className="stats-label">Comentarios</span>
              </div>
            </div>
            <div className="stats-details">
              <div className="stats-detail-item">
                <span className="detail-label">Promedio de likes por video:</span>
                <span className="detail-value">{currentStats.interactionStats.averageLikesPerVideo.toFixed(1)}</span>
              </div>
              <div className="stats-detail-item">
                <span className="detail-label">Promedio de comentarios:</span>
                <span className="detail-value">{currentStats.interactionStats.averageCommentsPerVideo.toFixed(1)}</span>
              </div>
            </div>
            <div className="popular-content">
              <h4>Contenido más popular</h4>
              <div className="popular-item">
                <div className="popular-icon"><FontAwesomeIcon icon={faThumbsUp} /></div>
                <div className="popular-info">
                  <div className="popular-title">{currentStats.interactionStats.mostLikedVideo.title}</div>
                  <div className="popular-stats">{currentStats.interactionStats.mostLikedVideo.likes} likes</div>
                </div>
              </div>
              <div className="popular-item">
                <div className="popular-icon"><FontAwesomeIcon icon={faComment} /></div>
                <div className="popular-info">
                  <div className="popular-title">{currentStats.interactionStats.mostCommentedVideo.title}</div>
                  <div className="popular-stats">{currentStats.interactionStats.mostCommentedVideo.comments} comentarios</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Statistics;
