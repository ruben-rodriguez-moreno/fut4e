import { useState } from 'react';

function Profile({ currentUser, onUpdateProfile }) {
  const [formData, setFormData] = useState({
    username: currentUser.username,
    description: currentUser.description || '',
    profilePicture: null
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append('username', formData.username);
    form.append('description', formData.description);
    if (formData.profilePicture) {
      form.append('profilePicture', formData.profilePicture);
    }

    try {
      const response = await fetch(`http://localhost:5000/api/auth/me`, {
        method: 'PUT',
        headers: {
          'x-auth-token': localStorage.getItem('token')
        },
        body: form
      });
      const data = await response.json();
      if (data.error) throw new Error(data.error);
      onUpdateProfile(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, profilePicture: e.target.files[0] });
  };

  return (
    <div className="profile-page">
      <h2>My Profile</h2>
      <form onSubmit={handleSubmit}>
        <div className="profile-picture">
          <img src={currentUser.profilePicture || '/default-profile.png'} alt="Profile" />
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>
        <input
          type="text"
          placeholder="Username"
          value={formData.username}
          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
        />
        <textarea
          placeholder="Description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
        <button type="submit">Update Profile</button>
      </form>
    </div>
  );
}

export default Profile;
