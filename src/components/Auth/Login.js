import { useState, useEffect } from 'react';
import { checkServerStatus, apiUrl } from '../../utils/apiConfig';

function Login({ onLogin }) {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [serverStatus, setServerStatus] = useState(true);

  useEffect(() => {
    const verifyServer = async () => {
      const isOnline = await checkServerStatus();
      setServerStatus(isOnline);
      
      if (!isOnline) {
        setError('No se pudo conectar con el servidor. Verifica que el servidor esté en ejecución en https://fut4e.onrender.com.');
      }
    };
    
    verifyServer();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    // Validación básica
    if (!formData.email || !formData.password) {
      setError('Por favor completa todos los campos');
      setIsLoading(false);
      return;
    }
    
    // Verificar conexión con servidor antes de intentar login
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
      console.log('Intentando login en:', apiUrl('/api/auth/login'));
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      
      const response = await fetch(apiUrl('/api/auth/login'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
        signal: controller.signal
      }).catch(err => {
        if (err.name === 'AbortError') {
          throw new Error('La solicitud de login excedió el tiempo máximo de espera. Verifica tu conexión o el estado del servidor.');
        }
        throw err;
      });
      
      clearTimeout(timeoutId);
      
      // Check if the response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        // Not a JSON response - might be an HTML error page
        const textError = await response.text();
        console.error('Server returned non-JSON response:', textError.substring(0, 150) + '...');
        
        if (response.status === 404) {
          throw new Error('La ruta de login no existe en el servidor. Verifica la configuración del backend.');
        } else if (response.status === 500) {
          throw new Error('Error interno del servidor. Consulta los logs del backend para más información.');
        } else if (response.status === 502 || response.status === 503 || response.status === 504) {
          throw new Error('El servidor no está disponible o no responde correctamente. Verifica que esté en ejecución.');
        } else {
          throw new Error(`El servidor respondió con estado ${response.status} y no devolvió JSON válido. Verifica la conexión o contacta al administrador.`);
        }
      }
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || `Error en el inicio de sesión (${response.status})`);
      }
      
      if (data.token) {
        localStorage.setItem('token', data.token);
        onLogin(data.user);
      } else {
        throw new Error('No se recibió token de autenticación');
      }
    } catch (err) {
      console.error('Error de inicio de sesión:', err);
      setServerStatus(false);
      
      if (err.message.includes('fetch') || err.message.includes('network') || err.message.includes('Failed to fetch')) {
        setError('Error de conexión: No se pudo contactar al servidor. Verifica tu red y que el backend esté en ejecución.');
      } else {
        setError(err.message || 'Credenciales inválidas');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <div className="error-message">
          {error}
          {!serverStatus && (
            <div className="server-status-info">
              <p>Posibles soluciones:</p>
              <ul>
                <li>Verifica que el servidor backend esté en ejecución en <code>https://fut4e.onrender.com</code></li>
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
      <input
        type="email"
        placeholder="Email"
        value={formData.email}
        onChange={(e) => setFormData({...formData, email: e.target.value})}
      />
      <input
        type="password"
        placeholder="Password"
        value={formData.password}
        onChange={(e) => setFormData({...formData, password: e.target.value})}
      />
      <button type="submit" disabled={isLoading || !serverStatus}>
        {isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
      </button>
    </form>
  );
}

export default Login;