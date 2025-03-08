import React, { useState, useEffect } from 'react';
import VideoCard from '../Video/VideoCard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilm, faFire } from '@fortawesome/free-solid-svg-icons';
import './Home.css';

function Home({ videos, currentUser, onLike, onComment, onDelete }) {
  const [filteredVideos, setFilteredVideos] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isLoading, setIsLoading] = useState(false);

  // Categorías disponibles
  const categories = [
    { id: 'all', name: 'Todos' },
    { id: 'football', name: 'Fútbol' },
    { id: 'skills', name: 'Habilidades' },
    { id: 'highlights', name: 'Momentos destacados' }
  ];

  // Efecto para filtrar videos cuando cambia la selección de categoría
  useEffect(() => {
    setIsLoading(true);
    
    // Simular una pequeña carga para mostrar la animación
    setTimeout(() => {
      if (selectedCategory === 'all') {
        setFilteredVideos(videos);
      } else {
        setFilteredVideos(videos.filter(video => video.category === selectedCategory));
      }
      setIsLoading(false);
    }, 300);
  }, [selectedCategory, videos]);

  // Obtener videos recientes (últimos 4)
  const recentVideos = [...videos].slice(0, 4);
  
  // Obtener videos populares (ordenados por likes)
  const popularVideos = [...videos]
    .sort((a, b) => b.likes.length - a.likes.length)
    .slice(0, 4);

  return (
    <div className="home-container">
      <header className="home-header">
        <h1 className="home-title">Descubre los mejores momentos del fútbol</h1>
        <p className="home-subtitle">Explora videos de habilidades, jugadas y momentos destacados compartidos por nuestra comunidad</p>
      </header>

      {videos.length > 0 && (
        <section className="home-featured">
          <h2 className="section-title">
            <FontAwesomeIcon icon={faFire} className="section-title-icon" />
            Videos populares
          </h2>
          <div className="video-grid">
            {popularVideos.map(video => (
              <VideoCard
                key={video._id}
                video={video}
                currentUser={currentUser}
                onLike={onLike}
                onComment={onComment}
                onDelete={onDelete}
              />
            ))}
          </div>
        </section>
      )}

      <section className="home-categories">
        <h2 className="section-title">
          <FontAwesomeIcon icon={faFilm} className="section-title-icon" />
          Explora videos
        </h2>
        
        <div className="category-chips">
          {categories.map(category => (
            <button
              key={category.id}
              className={`category-chip ${selectedCategory === category.id ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category.id)}
            >
              {category.name}
            </button>
          ))}
        </div>

        <div className="video-grid-container">
          {isLoading ? (
            <div className="loading-videos">
              <div className="loading-spinner"></div>
            </div>
          ) : filteredVideos.length > 0 ? (
            <div className="video-grid">
              {filteredVideos.map(video => (
                <VideoCard
                  key={video._id}
                  video={video}
                  currentUser={currentUser}
                  onLike={onLike}
                  onComment={onComment}
                  onDelete={onDelete}
                />
              ))}
            </div>
          ) : (
            <div className="no-videos-message">
              No hay videos disponibles en esta categoría.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default Home;