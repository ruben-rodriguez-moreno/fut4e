import { useState } from 'react';
import Login from './Login';
import Register from './Register';
import './AuthPage.css';

function AuthPage({ onLogin, onClose }) {
  const [isLoginMode, setIsLoginMode] = useState(true);

  return (
    <div className="auth-page">
      <div className="auth-container">
        <button className="auth-close-btn" onClick={onClose}>×</button>
        <h2>{isLoginMode ? 'Welcome Back!' : 'Create Account'}</h2>
        {isLoginMode ? (
          <>
            <Login onLogin={onLogin} />
            <p className="auth-switch">
              No tienes cuenta? 
              <button onClick={() => setIsLoginMode(false)}>
                Registrate
              </button>
            </p>
          </>
        ) : (
          <>
            <Register onRegister={onLogin} />
            <p className="auth-switch">
              Ya tienes una cuenta? 
              <button onClick={() => setIsLoginMode(true)}>
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