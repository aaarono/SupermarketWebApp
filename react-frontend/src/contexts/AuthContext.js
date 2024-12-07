// src/contexts/AuthContext.js
import React, { createContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { useNavigate, useLocation } from 'react-router-dom';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authData, setAuthData] = useState({ token: null, role: null });
  const [simulationBackup, setSimulationBackup] = useState(null);
  const [isEmulating, setIsEmulating] = useState(false);
  const [simulationEmail, setSimulationEmail] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const login = useCallback((token, role) => {
    localStorage.setItem('token', token);
    api.setAuthToken(token);
    setAuthData({ token, role });
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    api.setAuthToken(null);
    setAuthData({ token: null, role: null });
    setSimulationBackup(null);
    setIsEmulating(false);
    setSimulationEmail('');
  }, []);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken && !authData.token) {
      api.setAuthToken(storedToken);
      setAuthData({ token: storedToken, role: null });
    }
  }, [authData.token]);

  useEffect(() => {
    const fetchRole = async () => {
      if (authData.token && !authData.role) {
        try {
          const response = await api.get('/api/auth/role');
          if (response && response.role) {
            setAuthData(prev => ({ ...prev, role: response.role }));
            // Если мы эмулируем и только что получили роль симулируемого пользователя, перенаправляем на страницу этой роли
            if (isEmulating && response.role) {
              navigate('/' + response.role);
            }
          } else {
            setAuthData(prev => ({ ...prev, role: 'public' }));
          }
        } catch (error) {
          console.error('Error fetching role:', error);
          setAuthData(prev => ({ ...prev, role: 'public' }));
          if (error.status === 401) {
            logout();
            navigate('/login');
          }
        }
      }
    };
    fetchRole();
  }, [authData.token, authData.role, navigate, logout, isEmulating]);

  const setRole = (newRole) => {
    setAuthData(prev => ({ ...prev, role: newRole }));
  };

  // Начало симуляции
  const simulateUser = (simulationToken, email = 'useremail@emulation.com') => {
    const backup = {
      token: authData.token,
      role: authData.role,
      previousPath: location.pathname
    };
    setSimulationBackup(backup);

    localStorage.setItem('token', simulationToken);
    api.setAuthToken(simulationToken);
    setAuthData({ token: simulationToken, role: null });
    setIsEmulating(true);
    setSimulationEmail(email);
  };

  // Остановка симуляции
  const stopSimulation = () => {
    if (simulationBackup) {
      const { token, role, previousPath } = simulationBackup;
      if (token) {
        localStorage.setItem('token', token);
        api.setAuthToken(token);
        setAuthData({ token, role });
      } else {
        localStorage.removeItem('token');
        api.setAuthToken(null);
        setAuthData({ token: null, role: null });
      }
      setSimulationBackup(null);
      setIsEmulating(false);
      setSimulationEmail('');
      if (previousPath) {
        navigate(previousPath);
      } else {
        navigate('/');
      }
    } else {
      logout();
    }
  };

  const currentRole = authData.role || 'public';
  const currentToken = authData.token;

  return (
    <AuthContext.Provider value={{ role: currentRole, token: currentToken, login, logout, setRole, simulateUser, stopSimulation, isEmulating, simulationEmail }}>
      {children}
    </AuthContext.Provider>
  );
};
