import api from './api';

const login = async (username, password) => {
    try {
        const response = await api.post('/api/auth/login', { username, password });
        const token = response.token;
        api.setAuthToken(token);
        // Сохраните токен в localStorage или другом хранилище, если нужно
        localStorage.setItem('token', token);
        return response;
    } catch (error) {
        console.error('Ошибка при логине:', error);
        throw error;
    }
};

export { login };
