// api.js
import ApiService from './ApiService';

const api = new ApiService('http://localhost:8080');

// Получение токена из localStorage
const token = localStorage.getItem('token');
if (token) {
    api.setAuthToken(token);
}

export default api;

