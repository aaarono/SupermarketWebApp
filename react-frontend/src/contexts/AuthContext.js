// contexts/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authData, setAuthData] = useState({
    token: localStorage.getItem('token') || null,
    role: null,
  });

  const navigate = useNavigate();

  // Move the 'login' and 'logout' functions here
  const login = (token, role) => {
    localStorage.setItem('token', token);
    api.setAuthToken(token);
    setAuthData({ token, role });
  };

  const logout = () => {
    localStorage.removeItem('token');
    api.setAuthToken(null);
    setAuthData({ token: null, role: null });
  };

  useEffect(() => {
    const fetchRole = async () => {
      if (authData.token && !authData.role) {
        try {
          const response = await api.get('/api/auth/role');
          setAuthData((prev) => ({ ...prev, role: response.role }));
        } catch (error) {
          console.error('Error fetching role:', error);

          if (error.status === 401) {
            logout();
            navigate('/login');
          } else {
            console.error('An unexpected error occurred:', error);
          }
        }
      }
    };
    fetchRole();
  }, [authData.token, authData.role, navigate, logout]);

  return (
    <AuthContext.Provider value={{ authData, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
