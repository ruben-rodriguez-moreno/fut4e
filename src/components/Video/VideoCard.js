import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Comments from './Comments';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faComment, faTrash, faSpinner } from '@fortawesome/free-solid-svg-icons';
import './VideoCard.css';

function VideoCard({ video, currentUser, onLike, onComment, onDelete }) {
  const [showComments, setShowComments] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleLike = () => {
    onLike(video._id);
  };

  const handleDelete = async () => {
    setShowConfirmation(false);
    setIsDeleting(true);
    setDeleteError('');
    
    try {
      const response = await fetch(`http://localhost:5000/api/videos/${video._id}`, {
        method: 'DELETE',
        headers: {
          'x-auth-token': localStorage.getItem('token'),
          'Accept': 'application/json'
        }
      });

      // Check if response is JSON
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Server returned non-JSON response");
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete video');
      }

      if (data.success) {
        onDelete(video._id);
      } else {
        throw new Error(data.error || 'Failed to delete video');
      }
    } catch (err) {
      console.error('Delete error:', err);
      setDeleteError(err.message || 'Failed to delete video');
      setTimeout(() => setDeleteError(''), 3000);
    } finally {
      setIsDeleting(false);
    }
  };

  const isCreator = currentUser?._id === video.author?._id;
  const isLiked = currentUser && video.likes.some(like => like._id === currentUser._id);

  return (
    <>
      <div className="video-card">
        <video src={`http://localhost:5000${video.url}`} controls />
        <div className="video-info">
          <div className="video-header">
            <h3>{video.title}</h3>
            {isCreator && (
              <div className="delete-container">
                {deleteError && (
                  <span className="delete-error">{deleteError}</span>
                )}
                <button 
                  onClick={() => setShowConfirmation(true)}
                  className="delete-btn"
                  disabled={isDeleting}
                  aria-label="Delete video"
                >
                  {isDeleting ? (
                    <FontAwesomeIcon icon={faSpinner} spin />
                  ) : (
                    <FontAwesomeIcon icon={faTrash} />
                  )}
                </button>
              </div>
            )}
          </div>
          <p className="video-author">
            Por{' '}
            <Link 
              to={`/usuario/${video.author?.username || 'unknown'}`}
              className="author-link"
            >
              {video.author?.username || 'Unknown User'}
            </Link>
          </p>
          <div className="video-actions">
            <button 
              onClick={handleLike}
              className={!currentUser ? 'action-button disabled' : `action-button ${isLiked ? 'liked' : ''}`}
            >
              <FontAwesomeIcon icon={faHeart} className={isLiked ? 'liked-icon' : ''} />
              {video.likes.length} {video.likes.length === 1 ? 'Like' : 'Likes'}
            </button>
            <button onClick={() => setShowComments(!showComments)}>
              <FontAwesomeIcon icon={faComment} />
              {video.comments.length} {video.comments.length === 1 ? 'Comment' : 'Comments'}
            </button>
          </div>
          {showComments && (
            <Comments
              videoId={video._id}
              comments={video.comments}
              onCommentAdd={(updatedVideo) => onComment(video._id, updatedVideo)}
              isLoggedIn={!!currentUser}
            />
          )}
        </div>
      </div>

      {showConfirmation && (
        <div className="confirmation-dialog">
          <div className="confirmation-content">
            <h3>Delete Video</h3>
            <p>Are you sure you want to delete this video?</p>
            <p className="warning-text">This action cannot be undone.</p>
            <div className="confirmation-buttons">
              <button 
                className="cancel-btn"
                onClick={() => setShowConfirmation(false)}
              >
                Cancel
              </button>
              <button 
                className="confirm-delete-btn"
                onClick={handleDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default VideoCard;