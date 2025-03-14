import { useState } from 'react';
import Login from './Login';
import Register from './Register';
import ResetPassword from './ResetPassword';
import './AuthPage.css';

function AuthPage({ onLogin, onRegister, onClose, isLoginMode }) {
  const [showLoginMode, setShowLoginMode] = useState(isLoginMode ?? true);
  const [showResetPassword, setShowResetPassword] = useState(false);

  return (
    <div className="auth-page">
      <div className="auth-container animated-container">
        <button className="auth-close-btn" onClick={onClose}>×</button>
        
        {showResetPassword ? (
          <>
            <h2>Restablecer Contraseña</h2>
            <ResetPassword 
              onCancel={() => setShowResetPassword(false)} 
            />
          </>
        ) : showLoginMode ? (
          <>
            <h2>¡Bienvenido de nuevo!</h2>
            <Login onLogin={onLogin} />
            <p className="auth-switch">
              ¿No tienes cuenta? 
              <button onClick={() => setShowLoginMode(false)}>
                Registrate
              </button>
            </p>
            <p className="forgot-password">
              <button onClick={() => setShowResetPassword(true)}>
                ¿Olvidaste tu contraseña?
              </button>
            </p>
          </>
        ) : (
          <>
            <h2>Crear Cuenta</h2>
            <Register onRegister={onRegister} />
            <p className="auth-switch">
              ¿Ya tienes una cuenta? 
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