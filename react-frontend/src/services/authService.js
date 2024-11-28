import api from './api';

const login = async (email, password) => {
    try {
        const response = await api.post('/api/auth/login', { email, password });
        const token = response.token;
        api.setAuthToken(token);
        localStorage.setItem('token', token);
        return response;
    } catch (error) {
        console.error('Ошибка при логине:', error);
        throw error;
    }
};

const register = async (userData) => {
    try {
      const response = await api.post('/api/auth/register', userData);
      return response;
    } catch (error) {
      console.error('Ошибка при регистрации:', error);
      throw error;
    }
  };
  
export { login, register };