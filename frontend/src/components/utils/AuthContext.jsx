import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    username: localStorage.getItem('username') || '',
    token: localStorage.getItem('auth_token') || ''
  });

  const login = (username, token) => {
    localStorage.setItem('username', username);
    localStorage.setItem('auth_token', token);
    setAuthState({ username, token });
  };

  const logout = () => {
    localStorage.removeItem('username');
    localStorage.removeItem('auth_token');
    setAuthState({ username: '', token: '' });
  };

  return (
    <AuthContext.Provider value={{ authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
