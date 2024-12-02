// services/authService.js
import api from './api';

const login = async (email, password) => {
  try {
    const response = await api.post('/api/auth/login', { email, password });
    const token = response.token; // Adjusted to match response structure

    api.setAuthToken(token);
    localStorage.setItem('token', token);

    const roleResponse = await api.get('/api/auth/role');
    const role = roleResponse.role; // Adjusted to match response structure

    return { token, role };
  } catch (error) {
    console.error('Error during login:', error);
    throw error;
  }
};

const register = async (userData) => {
  try {
    const response = await api.post('/api/auth/register', userData);
    return response;
  } catch (error) {
    console.error('Error during registration:', error);
    throw error;
  }
};

export { login, register };
