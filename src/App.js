import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import './App.css';
import AuthPage from './components/Auth/AuthPage';
import VideoUpload from './components/Video/VideoUpload';
import Home from './components/Pages/Home';
import Trending from './components/Pages/Trending';
import Categories from './components/Pages/Categories';
import MyVideos from './components/Pages/MyVideos';
import Favorites from './components/Pages/Favorites';
import Profile from './components/Pages/Profile';
import EditProfile from './components/Pages/EditProfile';
import UserProfile from './components/Pages/UserProfile';
import UserProfilePublic from './components/Pages/UserProfilePublic';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faSearch } from '@fortawesome/free-solid-svg-icons';
import { getFullImageUrl } from './utils/imageUtils';
import Navigation from './components/Navigation/Navigation';
import UserSearch from './components/Pages/UserSearch';

// For the not found route since useNavigate must be used within Router context
function NotFoundPage() {
  const navigate = useNavigate();
  
  return (
    <div className="not-found-page">
      <h2>Página no encontrada</h2>
      <p>Lo sentimos, la página que buscas no existe.</p>
      <button onClick={() => navigate('/')}>Volver al inicio</button>
    </div>
  );
}

function App() {
  const [videos, setVideos] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [showUpload, setShowUpload] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [showLogin, setShowLogin] = useState(true);
  const [showMenu, setShowMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [currentPage, setCurrentPage] = useState('home'); // Added missing state

  const fetchVideos = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/videos');
      const data = await response.json();
      setVideos(data.map(video => ({
        ...video,
        author: video.author || { username: 'Unknown User' },
        comments: video.comments?.map(comment => ({
          ...comment,
          user: comment.user || { username: 'Unknown User' }
        })) || []
      })));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const fetchUserData = async () => {
        try {
          const response = await fetch('http://localhost:5000/api/auth/me', {
            headers: {
              'x-auth-token': token
            }
          });
          const data = await response.json();
          if (!data.error) {
            setCurrentUser(data);
          } else {
            // Si hay un error en la validación del token, limpiarlo
            localStorage.removeItem('token');
          }
        } catch (err) {
          console.error(err);
          localStorage.removeItem('token');
        }
      };
      fetchUserData();
    }
  }, []);

  useEffect(() => {
    fetchVideos();
  }, []);

  useEffect(() => {
    const handleAuthShow = (event) => {
      setShowAuth(true);
      setShowLogin(event.detail.isLogin);
    };

    window.addEventListener('showAuth', handleAuthShow);
    return () => {
      window.removeEventListener('showAuth', handleAuthShow);
    };
  }, []);

  const handleLogin = (userData) => {
    console.log('Login successful, user data:', userData);
    setCurrentUser(userData);
    setShowAuth(false);
    
    // Opcional: redirigir al usuario a la página de inicio o a su perfil
    setCurrentPage('home');
  };

  // Asegurarse de que esta función se pase correctamente a AuthPage
  const handleRegister = (userData) => {
    console.log('Registration successful, user data:', userData);
    setCurrentUser(userData);
    setShowAuth(false);
    setCurrentPage('home');
  };

  const handleVideoUpload = (newVideo) => {
    setVideos([newVideo, ...videos]);
    setShowUpload(false);
  };

  const handleLike = async (videoId) => {
    if (!currentUser) {
      setShowAuth(true);
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/videos/${videoId}/like`, {
        method: 'POST',
        headers: {
          'x-auth-token': localStorage.getItem('token')
        }
      });
      const data = await response.json();
      setVideos(videos.map(video => 
        video._id === videoId ? data : video
      ));
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (videoId) => {
    if (!currentUser) {
      setShowAuth(true);
      return;
    }

    if (!window.confirm('Are you sure you want to delete this video?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/videos/${videoId}`, {
        method: 'DELETE',
        headers: {
          'x-auth-token': localStorage.getItem('token')
        }
      });

      const data = await response.json();

      if (data.success) {
        setVideos(prevVideos => prevVideos.filter(video => video._id !== videoId));
      }
    } catch (err) {
      console.error('Error deleting video:', err);
    }
  };

  const handleComment = async (videoId, updatedVideo) => {
    setVideos(videos.map(video => 
      video._id === videoId ? updatedVideo : video
    ));
  };

  const handleAuthToggle = () => {
    setShowLogin(!showLogin);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    setShowMenu(false);
    setShowProfileMenu(false);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleUpdateProfile = (updatedUser) => {
    console.log('Perfil actualizado en App.js:', updatedUser);
    
    // Agregamos un parámetro de tiempo para evitar problemas de caché
    if (updatedUser.profilePicture && !updatedUser.profilePicture.includes('?t=')) {
      updatedUser.profilePicture = `${updatedUser.profilePicture}?t=${Date.now()}`;
    }
    
    setCurrentUser(updatedUser);
    setCurrentPage('profile');
  };

  const handleUserProfileSelect = (username) => {
    // Buscar al usuario por username y configurar el ID seleccionado
    const userVideo = videos.find(video => video.author?.username === username);
    if (userVideo && userVideo.author?._id) {
      return userVideo.author._id;
    }
    return null;
  };

  const filteredVideos = videos.filter(video =>
    video.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <BrowserRouter>
      <div className="App">
        <Navigation 
          currentUser={currentUser} 
          onSearch={handleSearch} 
          searchQuery={searchQuery}
          onShowAuth={() => {
            setShowLogin(true);
            setShowAuth(true);
          }}
          onLogout={() => {
            setCurrentUser(null);
            localStorage.removeItem('token');
          }}
          onUpload={() => setShowUpload(true)}
        />

        {showAuth && (
          <AuthPage 
            onLogin={handleLogin} 
            onRegister={handleRegister}
            isLoginMode={showLogin} 
            onToggleMode={handleAuthToggle}
            onClose={() => setShowAuth(false)}
          />
        )}

        {showUpload && (
          <div className="upload-modal">
            <VideoUpload onUpload={handleVideoUpload} />
            <button className="close-btn" onClick={() => setShowUpload(false)}>×</button>
          </div>
        )}

        <main className="main-content">
          <Routes>
            {/* Página principal - Videos recientes */}
            <Route path="/" element={
              <Home 
                videos={filteredVideos} 
                currentUser={currentUser} 
                onLike={handleLike} 
                onComment={handleComment} 
                onDelete={handleDelete} 
              />
            } />
            
            {/* Rutas de navegación principal */}
            <Route path="/trending" element={
              <Trending 
                videos={filteredVideos}
                currentUser={currentUser}
                onLike={handleLike}
                onComment={handleComment}
                onDelete={handleDelete}
              />
            } />
            <Route path="/categories" element={
              <Categories 
                videos={filteredVideos}
                currentUser={currentUser}
                onLike={handleLike}
                onComment={handleComment}
                onDelete={handleDelete}
              />
            } />
            
            {/* Rutas que requieren autenticación */}
            <Route path="/myvideos" element={
              currentUser ? (
                <MyVideos 
                  videos={filteredVideos}
                  currentUser={currentUser}
                  onLike={handleLike}
                  onComment={handleComment}
                  onDelete={handleDelete}
                />
              ) : <Navigate to="/" replace state={{ showLogin: true }} />
            } />
            <Route path="/favorites" element={
              currentUser ? (
                <Favorites 
                  videos={filteredVideos}
                  currentUser={currentUser}
                  onLike={handleLike}
                  onComment={handleComment}
                />
              ) : <Navigate to="/" replace state={{ showLogin: true }} />
            } />
            <Route path="/profile" element={
              currentUser ? (
                <Profile 
                  currentUser={currentUser} 
                  onUpdateProfile={handleUpdateProfile} 
                />
              ) : <Navigate to="/" replace state={{ showLogin: true }} />
            } />
            <Route path="/edit-profile" element={
              currentUser ? (
                <EditProfile 
                  currentUser={currentUser} 
                  onUpdateProfile={handleUpdateProfile}
                />
              ) : <Navigate to="/" replace state={{ showLogin: true }} />
            } />
            
            {/* Ruta para perfiles de usuario públicos */}
            <Route path="/usuario/:username" element={
              <UserProfile 
                currentUser={currentUser}
                onLike={handleLike}
                onComment={handleComment}
                onDelete={handleDelete}
                onUpdateProfile={handleUpdateProfile}
              />
            } />
            
            {/* Nueva ruta para perfiles públicos con mejor manejo de errores */}
            <Route path="/perfil/:username" element={
              <UserProfilePublic 
                currentUser={currentUser}
                onLike={handleLike}
                onComment={handleComment}
              />
            } />
            
            {/* Ruta para búsqueda de usuarios */}
            <Route path="/buscar-usuarios" element={
              <UserSearch />
            } />
            
            {/* Ruta de respaldo para manejar perfiles inválidos */}
            <Route path="/perfil" element={
              <Navigate to="/buscar-usuarios" replace />
            } />
            <Route path="/usuario" element={
              <Navigate to="/buscar-usuarios" replace />
            } />
            
            {/* Ruta para manejar URLs no encontradas */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;