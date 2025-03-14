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
import NewPasswordForm from './components/Auth/NewPasswordForm';
import Footer from './components/Footer/Footer';
import About from './components/Pages/About';
import Terms from './components/Pages/Terms';
import Privacy from './components/Pages/Privacy';
import Contact from './components/Pages/Contact';
// Import ErrorBoundary component
import ErrorBoundary from './components/Common/ErrorBoundary';

// Importar el componente AdminDashboard
import AdminDashboard from './components/Pages/Admin/AdminDashboard';

// Import the new VideoView component
import VideoView from './components/Pages/VideoView';

// Import ScrollToTop component
import ScrollToTop from './components/Utils/ScrollToTop';

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
      const response = await fetch('https://fut4e.onrender.com/api/videos');
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
          const response = await fetch('https://fut4e.onrender.com/api/auth/me', {
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
      // Check if this is a request to show upload UI
      if (event.detail && event.detail.isUpload) {
        setShowUpload(true);
        // Make sure auth modal is NOT shown when upload is requested
        setShowAuth(false);
      } else {
        // Only show auth modal if not requesting upload
        setShowAuth(true);
        setShowLogin(event.detail?.isLogin ?? true);
      }
    };

    const handleUploadShow = () => {
      setShowUpload(true);
    };

    window.addEventListener('showAuth', handleAuthShow);
    window.addEventListener('showUpload', handleUploadShow);
    
    return () => {
      window.removeEventListener('showAuth', handleAuthShow);
      window.removeEventListener('showUpload', handleUploadShow);
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
      const response = await fetch(`https://fut4e.onrender.com/api/videos/${videoId}/like`, {
        method: 'POST',
        headers: {
          'x-auth-token': localStorage.getItem('token'),
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Error al procesar el like');
      }
      
      const updatedVideo = await response.json();
      
      setVideos(videos.map(video => 
        video._id === videoId ? updatedVideo : video
      ));
    } catch (err) {
      console.error('Error al dar/quitar like:', err);
    }
  };

  const handleDelete = async (videoId) => {
    if (!currentUser) {
      setShowAuth(true);
      return;
    }

    try {
      console.log('[App] Iniciando eliminación del video:', videoId);
      
      // Notificar a todos los componentes que la eliminación está en proceso
      window.dispatchEvent(new CustomEvent('videoDeleteInProgress', { 
        detail: { videoId } 
      }));
      
      const response = await fetch(`https://fut4e.onrender.com/api/videos/${videoId}`, {
        method: 'DELETE',
        headers: {
          'x-auth-token': localStorage.getItem('token'),
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('[App] Respuesta del servidor:', data);

      if (data.success) {
        console.log('[App] Video eliminado con éxito, actualizando estado global');
        
        // IMPORTANTE: Crear una versión inmutable del estado para la actualización
        const previousVideos = [...videos];
        
        // Actualizar el estado usando una función callback para garantizar el estado más reciente
        setVideos(prevState => {
          const updatedVideos = prevState.filter(video => video._id !== videoId);
          console.log(`[App] Videos antes: ${prevState.length}, después: ${updatedVideos.length}`);
          return updatedVideos;
        });
        
        // Notificar a todos los componentes que la eliminación fue exitosa
        window.dispatchEvent(new CustomEvent('videoDeleteSuccess', { 
          detail: { videoId, timestamp: Date.now() } 
        }));
        
        // Forzar actualización en el siguiente ciclo para asegurar consistencia
        setTimeout(() => {
          const remainingVideos = videos.filter(v => v._id === videoId);
          if (remainingVideos.length > 0) {
            console.warn('[App] Inconsistencia detectada, forzando actualización del estado');
            setVideos(previous => previous.filter(v => v._id !== videoId));
          }
        }, 300);
        
        return { success: true, data };
      }
      
      throw new Error(data.message || 'Error desconocido al eliminar el video');
      
    } catch (err) {
      console.error('[App] Error al eliminar video:', err);
      
      // Notificar del error a todos los componentes interesados
      window.dispatchEvent(new CustomEvent('videoDeleteError', { 
        detail: { videoId, error: err.message } 
      }));
      
      throw err;
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
      <ScrollToTop /> {/* Añadir componente ScrollToTop aquí */}
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
                  onUpload={() => setShowUpload(true)}  // Add this line
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
            
            {/* Añadir la ruta para la página Acerca de */}
            <Route path="/about" element={<About />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/contact" element={<Contact />} />
            
            {/* Ruta para el panel administrativo */}
            <Route path="/admin" element={
              <AdminDashboard currentUser={currentUser} />
            } />
            
            {/* Add new route for viewing individual videos */}
            <Route path="/video/:videoId" element={
              <ErrorBoundary fallback={<div className="error-container">Ha ocurrido un error al cargar la página del video.</div>}>
                <VideoView 
                  currentUser={currentUser}
                  onLike={handleLike}
                  onComment={handleComment}
                  onDelete={handleDelete}
                />
              </ErrorBoundary>
            } />
            
            {/* Ruta para manejar URLs no encontradas */}
            <Route path="*" element={<NotFoundPage />} />
            <Route path="/reset-password/:token" element={<NewPasswordForm />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;