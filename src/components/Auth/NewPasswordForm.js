import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { checkServerStatus, apiUrl } from '../../utils/apiConfig';
import './NewPasswordForm.css';

function NewPasswordForm() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [serverStatus, setServerStatus] = useState(true);
  const [tokenValid, setTokenValid] = useState(true);
  
  const { token } = useParams();
  const navigate = useNavigate();

  // Verificar estado del servidor al cargar el componente
  useEffect(() => {
    const verifyServer = async () => {
      const isOnline = await checkServerStatus();
      setServerStatus(isOnline);
      
      if (!isOnline) {
        setError('No se pudo conectar con el servidor. Verifica que el servidor esté en ejecución.');
      }
    };
    
    verifyServer();
  }, []);

  // Validar el formato del token (básico)
  useEffect(() => {
    if (!token || token.length < 20) {
      setTokenValid(false);
      setError('El enlace de restablecimiento no es válido o ha expirado.');
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);
    
    // Validación de las contraseñas
    if (!password || !confirmPassword) {
      setError('Por favor completa todos los campos');
      setIsLoading(false);
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      setIsLoading(false);
      return;
    }
    
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      setIsLoading(false);
      return;
    }

    // Verificar conexión con servidor
    if (!serverStatus) {
      const isOnline = await checkServerStatus();
      setServerStatus(isOnline);
      
      if (!isOnline) {
        setError('No se pudo conectar con el servidor. Verifica tu conexión a internet.');
        setIsLoading(false);
        return;
      }
    }
    
    try {
      console.log('Enviando nueva contraseña:', apiUrl(`/api/auth/reset-password/${token}`));
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      
      const response = await fetch(apiUrl(`/api/auth/reset-password/${token}`), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
        signal: controller.signal
      }).catch(err => {
        if (err.name === 'AbortError') {
          throw new Error('La solicitud excedió el tiempo máximo de espera. Verifica tu conexión.');
        }
        throw err;
      });
      
      clearTimeout(timeoutId);
      
      // Verificar la respuesta
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const textError = await response.text();
        console.error('Server returned non-JSON response:', textError.substring(0, 150) + '...');
        
        throw new Error('La respuesta del servidor no es válida. Por favor intenta más tarde.');
      }
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || `Error en la solicitud (${response.status})`);
      }
      
      // Mostrar mensaje de éxito
      setSuccess(data.message || 'Contraseña actualizada con éxito');
      setPassword('');
      setConfirmPassword('');
      
      // Redirigir al login después de un tiempo
      setTimeout(() => {
        navigate('/');
      }, 3000);
      
    } catch (err) {
      console.error('Error al restablecer contraseña:', err);
      setServerStatus(false);
      
      if (err.message.includes('fetch') || err.message.includes('network')) {
        setError('Error de conexión: No se pudo contactar al servidor.');
      } else {
        setError(err.message || 'Error al procesar la solicitud. Inténtalo de nuevo.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!tokenValid) {
    return (
      <div className="password-reset-container">
        <div className="password-reset-card">
          <div className="reset-error-message">
            <h3>Enlace no válido</h3>
            <p>El enlace de restablecimiento no es válido o ha expirado.</p>
            <p>Por favor solicita un nuevo enlace de restablecimiento.</p>
          </div>
          <button 
            className="reset-submit-button"
            onClick={() => navigate('/')}
          >
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="password-reset-container">
      <div className="password-reset-card">
        <h2 className="password-reset-title">Restablecer contraseña</h2>
        
        {error && (
          <div className="reset-error-message">
            {error}
          </div>
        )}
        
        {success && (
          <div className="reset-success-message">
            {success}
            <p>Redirigiendo al inicio de sesión...</p>
          </div>
        )}
        
        {!success && (
          <form onSubmit={handleSubmit} className="password-reset-form">
            <p className="password-reset-description">
              Ingresa tu nueva contraseña para completar el proceso de restablecimiento.
            </p>
            
            <div className="form-group">
              <label htmlFor="new-password">Nueva contraseña</label>
              <input
                type="password"
                id="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="password-input"
                autoComplete="new-password"
                placeholder="Ingresa tu nueva contraseña"
                disabled={isLoading}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="confirm-password">Confirmar contraseña</label>
              <input
                type="password"
                id="confirm-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="password-input"
                autoComplete="new-password"
                placeholder="Confirma tu contraseña"
                disabled={isLoading}
              />
            </div>
            
            <button 
              type="submit" 
              className="reset-submit-button"
              disabled={isLoading}
            >
              {isLoading ? 'Procesando...' : 'Cambiar contraseña'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default NewPasswordForm;
