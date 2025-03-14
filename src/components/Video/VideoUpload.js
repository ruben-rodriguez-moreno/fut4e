import { useState } from 'react';

function VideoUpload({ onUpload }) {
  const [videoData, setVideoData] = useState({
    title: '',
    file: null,
    category: 'football' // Categoría predeterminada
  });
  const [error, setError] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUploading(true);
    setError('');
    const formData = new FormData();
    formData.append('title', videoData.title);
    formData.append('video', videoData.file);
    formData.append('category', videoData.category);

    try {
      const response = await fetch('http://localhost:5000/api/videos', {
        method: 'POST',
        headers: {
          'x-auth-token': localStorage.getItem('token')
        },
        body: formData
      });
      const data = await response.json();
      if (data.error) throw new Error(data.error);
      onUpload(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="upload-form">
      <h3>Subir Vídeo</h3>
      <input
        type="text"
        placeholder="Título del vídeo"
        value={videoData.title}
        onChange={(e) => setVideoData({...videoData, title: e.target.value})}
        required
      />
      <select
        value={videoData.category}
        onChange={(e) => setVideoData({...videoData, category: e.target.value})}
        required
      >
        <option value="football">Fútbol</option>
        <option value="skills">Skills</option>
        <option value="highlights">Highlights</option>
      </select>
      <input
        type="file"
        accept="video/*"
        onChange={(e) => setVideoData({...videoData, file: e.target.files[0]})}
        required
      />
      {error && <div className="error-message">{error}</div>}
      <button type="submit" disabled={isUploading}>
        {isUploading ? 'Subiendo...' : 'Subir Vídeo'}
      </button>
    </form>
  );
}

export default VideoUpload;