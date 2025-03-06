import { useState, useEffect } from 'react';
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
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faSearch } from '@fortawesome/free-solid-svg-icons';

function App() {
  const [videos, setVideos] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [showUpload, setShowUpload] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [showLogin, setShowLogin] = useState(true);
  const [currentPage, setCurrentPage] = useState('home');
  const [showMenu, setShowMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUserId] = useState(null);


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
    setCurrentUser(userData);
    setShowAuth(false);
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
    setCurrentUser(updatedUser);
    setCurrentPage('profile');
  };

  const filteredVideos = videos.filter(video =>
    video.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderPage = () => {
    const commonProps = {
      videos: filteredVideos,
      currentUser,
      onLike: handleLike,
      onComment: handleComment,
      onDelete: handleDelete
    };

    switch(currentPage) {
      case 'home':
        return <Home {...commonProps} />;
      case 'trending':
        return <Trending {...commonProps} />;
      case 'categories':
        return <Categories {...commonProps} />;
      case 'myVideos':
        return currentUser ? <MyVideos {...commonProps} /> : null;
      case 'favorites':
        return currentUser ? <Favorites {...commonProps} /> : null;
      case 'profile':
        return currentUser ? <Profile currentUser={currentUser} onEditProfile={() => setCurrentPage('editProfile')} {...commonProps} /> : null;
      case 'editProfile':
        return currentUser ? <EditProfile currentUser={currentUser} onUpdateProfile={handleUpdateProfile} /> : null;
      case 'userProfile':
        return <UserProfile userId={selectedUserId} {...commonProps} />;
      default:
        return <Home {...commonProps} />;
    }
  };

  return (
    <div className="App">
      <nav className="navbar">
        <div className="nav-left">
          <h1>FUT4E</h1>
          <div className="menu-container">
            <button 
              className="menu-trigger" 
              onClick={() => setShowMenu(!showMenu)}
              aria-label="Menu"
            >
              <div className="hamburger-icon">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </button>
            {showMenu && (
              <div className="context-menu">
                <div className="menu-section">
                  <h3 className="menu-title">Browse</h3>
                  <button 
                    className="menu-item"
                    onClick={() => handlePageChange('home')}
                  >
                    <i className="menu-icon">🏠</i>
                    Home
                  </button>
                  <button 
                    className="menu-item"
                    onClick={() => handlePageChange('trending')}
                  >
                    <i className="menu-icon">🔥</i>
                    Trending
                  </button>
                  <button 
                    className="menu-item"
                    onClick={() => handlePageChange('categories')}
                  >
                    <i className="menu-icon">📂</i>
                    Categories
                  </button>
                </div>
                
                {currentUser && (
                  <div className="menu-section">
                    <h3 className="menu-title">My Content</h3>
                    <button 
                      className="menu-item"
                      onClick={() => setShowUpload(true)}
                    >
                      <i className="menu-icon">📤</i>
                      Upload Video
                    </button>
                    <button 
                      className="menu-item"
                      onClick={() => handlePageChange('myVideos')}
                    >
                      <i className="menu-icon">🎥</i>
                      My Videos
                    </button>
                    <button 
                      className="menu-item"
                      onClick={() => handlePageChange('favorites')}
                    >
                      <i className="menu-icon">⭐</i>
                      Favorites
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        <div className="search-bar">
          <input 
            type="text" 
            placeholder="Search videos..." 
            value={searchQuery}
            onChange={handleSearch}
          />
          <button className="search-icon">
            <FontAwesomeIcon icon={faSearch} />
          </button>
        </div>
        {currentUser ? (
          <div className="user-controls">
            <span>Welcome, {currentUser.username}</span>
            <div className="profile-menu">
              <button className="profile-icon" onClick={() => setShowProfileMenu(!showProfileMenu)}>
                <FontAwesomeIcon icon={faUser} />
              </button>
              {showProfileMenu && (
                <div className="profile-context-menu">
                  <div className="menu-section">
                    <button 
                      className="menu-item"
                      onClick={() => handlePageChange('profile')}
                    >
                      <i className="menu-icon">👤</i>
                      Profile
                    </button>
                    <button 
                      className="menu-item"
                      onClick={() => {
                        setCurrentUser(null);
                        localStorage.removeItem('token');
                      }}
                    >
                      <i className="menu-icon">🚪</i>
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <button className="auth-icon" onClick={() => setShowAuth(true)}>
            <FontAwesomeIcon icon={faUser} />
          </button>
        )}
      </nav>

      {showAuth && (
        <AuthPage 
          onLogin={handleLogin} 
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
        {renderPage()}
      </main>
    </div>
  );
}

export default App;