/**
 * Utility functions for API communication with improved error handling
 */

import { API_BASE_URL, API_TIMEOUT } from './apiConfig';

/**
 * Fetch with timeout and better error handling
 * @param {string} url - URL to fetch
 * @param {Object} options - Fetch options
 * @param {number} timeout - Timeout in milliseconds
 * @returns {Promise} - Response or error
 */
export const fetchWithErrorHandling = async (url, options = {}, timeout = API_TIMEOUT) => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    }).catch(err => {
      if (err.name === 'AbortError') {
        throw new Error('La solicitud ha excedido el tiempo de espera. Verifica tu conexión o el estado del servidor.');
      }
      throw new Error('No se puede conectar al servidor. Verifica tu conexión o si el servidor está en ejecución.');
    });
    
    clearTimeout(timeoutId);
    
    return response;
  } catch (err) {
    console.error('Error in fetchWithErrorHandling:', err);
    throw err;
  }
};

/**
 * Check if the server is running
 */
export const checkServerStatus = async () => {
  try {
    // Try multiple endpoints to detect if server is running
    const endpoints = [
      '/api/health',
      '/api/auth/status',
      '/api/videos'
    ];
    
    for (const endpoint of endpoints) {
      try {
        const response = await fetchWithErrorHandling(`${API_BASE_URL}${endpoint}`, {}, 3000);
        if (response.ok) {
          return true;
        }
      } catch (endpointError) {
        console.log(`Endpoint ${endpoint} failed:`, endpointError.message);
        // Continue to the next endpoint
      }
    }
    
    // If we tried all endpoints and none worked
    return false;
  } catch (err) {
    console.error('Error checking server status:', err);
    return false;
  }
};
