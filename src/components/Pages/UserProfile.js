import { useState, useEffect } from 'react';
import VideoCard from '../Video/VideoCard';
import './UserProfile.css'; // Ensure to create this file with appropriate styles

function UserProfile({ userId, currentUser, onLike, onComment, onDelete }) {
  const [user, setUser] = useState(null);
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/auth/${userId}`);
        const data = await response.json();
        setUser(data);
      } catch (err) {
        console.error(err);
      }
    };

    const fetchUserVideos = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/videos?author=${userId}`);
        const data = await response.json();
        setVideos(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchUser();
    fetchUserVideos();
  }, [userId]);

  const handleEditProfile = () => {
    // Implement the logic to edit the profile, such as opening a form/modal
    console.log('Editar perfil');
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className="user-profile">
      <header className="profile-header">
        <img src={user.profilePicture || '/default-profile.png'} alt="Profile" className="profile-pic" />
        <div className="profile-info">
          <h2>{user.username}</h2>
          <p>{user.description}</p>
        </div>
      </header>
      <section className="profile-content">
        <div className="video-grid">
          {videos.map(video => (
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
      <button onClick={handleEditProfile} className="edit-profile-button">
        Editar Perfil
      </button>
    </div>
  );
}

export default UserProfile;
