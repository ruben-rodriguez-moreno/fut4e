import { useState } from 'react';
import Login from './Login';
import Register from './Register';
import './AuthPage.css';

function AuthPage({ onLogin, onRegister, onClose, isLoginMode }) {
  const [showLoginMode, setShowLoginMode] = useState(isLoginMode ?? true);

  return (
    <div className="auth-page">
      <div className="auth-container animated-container">
        <button className="auth-close-btn" onClick={onClose}>×</button>
        <h2>{showLoginMode ? 'Welcome Back!' : 'Create Account'}</h2>
        {showLoginMode ? (
          <>
            <Login onLogin={onLogin} />
            <p className="auth-switch">
              No tienes cuenta? 
              <button onClick={() => setShowLoginMode(false)}>
                Registrate
              </button>
            </p>
          </>
        ) : (
          <>
            <Register onRegister={onRegister} />
            <p className="auth-switch">
              Ya tienes una cuenta? 
              <button onClick={() => setShowLoginMode(true)}>
                Inicia sesión
              </button>
            </p>
          </>
        )}
      </div>
    </div>
  );
}

export default AuthPage;