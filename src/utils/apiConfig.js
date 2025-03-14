/**
 * Configuración centralizada de la API
 */

// URL base de la API
export const API_BASE_URL = 'https://fut4e.onrender.com';

// Timeout para solicitudes en milisegundos
export const API_TIMEOUT = 10000;

// Función para verificar si el servidor está en línea
export const checkServerStatus = async () => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    // Primero intentamos con /api/auth/status
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/status`, {
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (response.ok) {
        console.log('Servidor en línea: /api/auth/status respondió correctamente');
        return true;
      }
    } catch (innerError) {
      console.log('No se pudo conectar a /api/auth/status, intentando verificar rutas principales...');
    }
    
    // Si el endpoint status no responde, intentamos con una ruta alternativa
    try {
      const rootResponse = await fetch(`${API_BASE_URL}/api/auth`, {
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      return true; // Si no lanza error, asumimos que el servidor está funcionando
    } catch (rootError) {
      console.log('No se pudo conectar al servidor en absoluto');
      throw rootError;
    }
  } catch (error) {
    console.error('Error verificando el estado del servidor:', error);
    return false;
  }
};

// Función para construir URLs de la API
export const apiUrl = (path) => {
  return `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;
};
