/**
 * Construye una URL completa para recursos almacenados en el servidor
 * @param {string} relativePath - Ruta relativa de la imagen (ej: /uploads/profile_pictures/img.jpg)
 * @param {string} defaultPath - Ruta predeterminada si no hay imagen (opcional)
 * @param {boolean} avoidCache - Si es true, agrega un parámetro de tiempo para evitar la caché
 * @returns {string} - URL completa de la imagen
 */
export const getFullImageUrl = (relativePath, defaultPath = '/default-profile.png', avoidCache = false) => {
  if (!relativePath) return defaultPath;
  
  // Si la ruta ya comienza con http:// o https://, asumimos que ya es una URL completa
  if (relativePath.startsWith('http://') || relativePath.startsWith('https://')) {
    return avoidCache && !relativePath.includes('?') 
      ? `${relativePath}?t=${Date.now()}`
      : relativePath;
  }
  
  // La URL base del servidor API
  const API_BASE_URL = 'http://localhost:5000';
  
  // Asegurarse de que la ruta relativa comienza con "/"
  const normalizedPath = relativePath.startsWith('/') 
    ? relativePath 
    : `/${relativePath}`;
  
  // Construir la URL completa
  const fullUrl = `${API_BASE_URL}${normalizedPath}`;
  
  // Añadir parámetro para evitar caché si es necesario
  return avoidCache && !fullUrl.includes('?') 
    ? `${fullUrl}?t=${Date.now()}` 
    : fullUrl;
};
