import { useState } from 'react';
import { getAuthHeaders } from '../../utils/auth';
import { Link } from 'react-router-dom';

function Comments({ videoId, comments, onCommentAdd, isLoggedIn }) {
  const [newComment, setNewComment] = useState('');
  const [error, setError] = useState('');
  const [showLoginMessage, setShowLoginMessage] = useState(false);

  // Add this function to handle the registration button click
  const handleRegisterClick = () => {
    // Trigger the auth modal through an event
    const authEvent = new CustomEvent('showAuth', { 
      detail: { isLogin: false } 
    });
    window.dispatchEvent(authEvent);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!isLoggedIn) {
      setShowLoginMessage(true);
      return;
    }

    if (!newComment.trim()) {
      setError('Comment cannot be empty');
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/videos/${videoId}/comment`, {
        method: 'POST',
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text: newComment.trim() })
      });
      const data = await response.json();
      if (data.error) throw new Error(data.error);
      onCommentAdd(data);
      setNewComment('');
      setShowLoginMessage(false);
    } catch (err) {
      setError(err.message);
      console.error(err);
    }
  };

  return (
    <div className="comments-section">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Añadir un comentario..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        {error && <div className="error-message">{error}</div>}
        <button type="submit" disabled={!newComment.trim()}>Comentar</button>
      </form>

      {!isLoggedIn && showLoginMessage && (
        <div className="login-message">
          <p>Tienes que registrarte primero para comentar</p>
          <button 
            className="login-button"
            onClick={handleRegisterClick}
          >
            Registrarse
          </button>
        </div>
      )}

      <div className="comments-list">
        {comments?.map((comment, index) => (
          <div key={index} className="comment">
            <Link 
              to={`/perfil/${encodeURIComponent(comment.user?.username || '')}`} 
              className="comment-author-link"
              onClick={(e) => {
                // Validar que el autor tiene un nombre de usuario válido
                if (!comment.user?.username || comment.user.username.trim() === '') {
                  e.preventDefault();
                  alert('Información de autor no disponible');
                  return;
                }
              }}
            >
              {comment.user?.username || 'Usuario desconocido'}
            </Link>
            <p>{comment.text}</p>
            <small>{new Date(comment.date).toLocaleDateString()}</small>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Comments;