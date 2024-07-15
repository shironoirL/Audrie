import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    username: localStorage.getItem('username') || '',
    email: localStorage.getItem('email') || '',
    token: localStorage.getItem('auth_token') || ''
  });

  const fetchUserDetails = async (token) => {
    try {
      const response = await axios.get('/api/auth/users/me/', {
        headers: {
          Authorization: `Token ${token}`
        }
      });
      const { username, email } = response.data;
      localStorage.setItem('username', username);
      localStorage.setItem('email', email);
      setAuthState({ username, email, token });
    } catch (error) {
      console.error('Failed to fetch user details:', error);
    }
  };

  const login = (token) => {
    localStorage.setItem('auth_token', token);
    setAuthState((prevState) => ({ ...prevState, token }));
    fetchUserDetails(token);
  };

  const logout = () => {
    localStorage.removeItem('username');
    localStorage.removeItem('email');
    localStorage.removeItem('auth_token');
    setAuthState({ username: '', email: '', token: '' });
  };

  useEffect(() => {
    if (authState.token) {
      fetchUserDetails(authState.token);
    }
  }, [authState.token]);

  return (
    <AuthContext.Provider value={{ authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
