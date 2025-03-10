import { API_BASE_URL } from './apiConfig';

/**
 * Construye la URL completa para las imágenes y archivos
 * @param {string} path - Ruta relativa del archivo
 * @returns {string} - URL completa del archivo
 */
export const getFullImageUrl = (path) => {
  if (!path) return `${API_BASE_URL}/default-profile.png`;

  // Si ya es una URL completa (http:// o https://)
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }

  // Si es una ruta relativa comenzando con /
  if (path.startsWith('/')) {
    return `${API_BASE_URL}${path}`; 
  }

  // Para otros casos, asumimos que es un archivo en la carpeta uploads
  return `${API_BASE_URL}/uploads/${path}`;
};

/**
 * Construye la URL para las miniaturas de videos
 * @param {string} videoUrl - URL del video
 * @returns {string} - URL de la miniatura
 */
export const getVideoThumbnailUrl = (videoUrl) => {
  if (!videoUrl) return `${API_BASE_URL}/default-thumbnail.jpg`;
  
  // Lógica para conseguir la miniatura del video
  // Por ahora, usamos la URL por defecto
  return `${API_BASE_URL}/default-thumbnail.jpg`;
};
