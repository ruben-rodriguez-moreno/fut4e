import { useState, useEffect } from 'react';
import { checkServerStatus, apiUrl } from '../../utils/apiConfig';
import './ResetPassword.css';

function ResetPassword({ onCancel }) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [serverStatus, setServerStatus] = useState(true);

  // Verificar estado del servidor al cargar el componente
  useEffect(() => {
    const verifyServer = async () => {
      const isOnline = await checkServerStatus();
      setServerStatus(isOnline);
      
      if (!isOnline) {
        setError('No se pudo conectar con el servidor. Verifica que el servidor esté en ejecución en localhost:5000.');
      }
    };
    
    verifyServer();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);
    
    // Validación mejorada del email
    if (!email) {
      setError('Por favor ingresa tu dirección de correo electrónico');
      setIsLoading(false);
      return;
    }
    
    // Validación básica del formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Por favor ingresa un email válido');
      setIsLoading(false);
      return;
    }

    // Verificar conexión con servidor
    if (!serverStatus) {
      const isOnline = await checkServerStatus();
      setServerStatus(isOnline);
      
      if (!isOnline) {
        setError('No se pudo conectar con el servidor. Verifica tu conexión a internet y que el servidor esté en ejecución.');
        setIsLoading(false);
        return;
      }
    }
    
    try {
      console.log('Solicitando restablecimiento de contraseña:', apiUrl('/api/auth/reset-password'));
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      
      const response = await fetch(apiUrl('/api/auth/reset-password'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
        signal: controller.signal
      }).catch(err => {
        if (err.name === 'AbortError') {
          throw new Error('La solicitud excedió el tiempo máximo de espera. Verifica tu conexión o el estado del servidor.');
        }
        throw err;
      });
      
      clearTimeout(timeoutId);
      
      // Verificar si la respuesta es JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const textError = await response.text();
        console.error('Server returned non-JSON response:', textError.substring(0, 150) + '...');
        
        if (response.status === 404) {
          throw new Error('La ruta de restablecimiento no existe en el servidor. Verifica la configuración del backend.');
        } else if (response.status === 500) {
          throw new Error('Error interno del servidor. Consulta los logs del backend para más información.');
        } else {
          throw new Error(`El servidor respondió con estado ${response.status} y no devolvió JSON válido.`);
        }
      }
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || `Error en la solicitud (${response.status})`);
      }
      
      // Mostrar mensaje de éxito más detallado
      setSuccess(
        data.message || 
        `Hemos enviado un correo a ${email} con instrucciones para restablecer tu contraseña. 
        Por favor revisa tu bandeja de entrada y también la carpeta de spam.`
      );
      setEmail(''); // Limpiar el formulario
      
    } catch (err) {
      console.error('Error al solicitar restablecimiento:', err);
      setServerStatus(false);
      
      if (err.message.includes('fetch') || err.message.includes('network') || err.message.includes('Failed to fetch')) {
        setError('Error de conexión: No se pudo contactar al servidor. Verifica tu red y que el backend esté en ejecución.');
      } else {
        setError(err.message || 'Error al procesar la solicitud. Inténtalo de nuevo.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="reset-password-form">
      {error && (
        <div className="reset-error-message">
          {error}
          {!serverStatus && (
            <div className="server-status-info">
              <p>Posibles soluciones:</p>
              <ul>
                <li>Verifica que el servidor backend esté en ejecución en <code>http://localhost:5000</code></li>
                <li>Ejecuta el servidor con <code>npm start</code> o <code>node server.js</code> en la carpeta backend</li>
                <li>Comprueba si hay errores en la consola del servidor</li>
              </ul>
              <button 
                type="button" 
                className="retry-button"
                onClick={async () => {
                  const isOnline = await checkServerStatus();
                  setServerStatus(isOnline);
                  if (isOnline) {
                    setError('');
                  }
                }}
              >
                Comprobar conexión
              </button>
            </div>
          )}
        </div>
      )}
      
      {success && (
        <div className="reset-success-message">
          {success}
        </div>
      )}
      
      <h3 className="reset-form-title">Recuperación de contraseña</h3>
      
      <p className="reset-form-description">
        Ingresa tu correo electrónico y te enviaremos instrucciones para restablecer tu contraseña.
      </p>
      
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="reset-email-input"
        autoComplete="email"
      />
      
      <button 
        type="submit" 
        className="reset-submit-button"
        disabled={isLoading || !serverStatus}
      >
        {isLoading ? 'Enviando...' : 'Enviar instrucciones'}
      </button>
      
      <div className="reset-form-actions">
        <button 
          type="button" 
          className="reset-back-button"
          onClick={onCancel}
        >
          Volver al inicio de sesión
        </button>
      </div>
    </form>
  );
}

export default ResetPassword;
