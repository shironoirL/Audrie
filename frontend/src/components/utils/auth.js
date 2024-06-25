// utils/auth.js

export const getAuthToken = () => {
  return localStorage.getItem('auth_token');
};
