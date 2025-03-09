/**
 * Utility functions for videos
 */

/**
 * Validates if the provided video ID is in a valid format
 * @param {string} id - Video ID to validate
 * @returns {boolean} - True if valid, false otherwise
 */
export const isValidVideoId = (id) => {
  // MongoDB ObjectId is a 24 character hex string
  return /^[0-9a-fA-F]{24}$/.test(id);
};

/**
 * Format an error message for video retrieval
 * @param {Error} error - Error object
 * @param {string} videoId - Video ID
 * @returns {string} - Formatted error message
 */
export const formatVideoError = (error, videoId) => {
  if (!isValidVideoId(videoId)) {
    return 'ID de video inválido. Por favor verifica la URL.';
  }
  
  if (error.message.includes('404')) {
    return 'El video solicitado no existe o ha sido eliminado.';
  }
  
  if (error.message.includes('conectar al servidor')) {
    return 'No se puede conectar al servidor. Verifica tu conexión a internet o si el servidor está en ejecución.';
  }
  
  return error.message || 'Error desconocido al cargar el video.';
};
