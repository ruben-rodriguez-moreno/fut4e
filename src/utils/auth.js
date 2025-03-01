export const getAuthHeaders = () => ({
  'Content-Type': 'application/json',
  'x-auth-token': localStorage.getItem('token')
});