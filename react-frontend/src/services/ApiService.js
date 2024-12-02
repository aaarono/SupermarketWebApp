// apiService.js

class ApiService {
    constructor(baseURL = '') {
        this.baseURL = baseURL;
        this.defaultHeaders = {
            'Content-Type': 'application/json',
        };
    }

    // Метод для установки токена
    setAuthToken(token) {
        this.defaultHeaders['Authorization'] = `Bearer ${token}`;
    }

    // Метод для объединения базового URL и endpoint
    getFullURL(endpoint) {
        return `${this.baseURL}${endpoint}`;
    }

    // Универсальный метод для выполнения запросов
    async request(method, endpoint, body = null, headers = {}) {
        const url = this.getFullURL(endpoint);
        const options = {
            method: method.toUpperCase(),
            headers: {
                ...this.defaultHeaders,
                ...headers,
            },
        };

        if (body) {
            options.body = JSON.stringify(body);
        }

        try {
            const response = await fetch(url, options);
            // Check response status
            const contentType = response.headers.get('content-type');

            // Проверка успешности ответа
            if (!response.ok) {
                // Attempt to parse error details from the response
                let errorDetails = '';
                if (contentType && contentType.includes('application/json')) {
                  const errorData = await response.json();
                  errorDetails = errorData.message || JSON.stringify(errorData);
                } else {
                  errorDetails = await response.text();
                }
        
                // Throw an error with status code and details
                const error = new Error(`Ошибка ${response.status}: ${errorDetails}`);
                error.status = response.status;
                throw error;
              }

            // Определение типа контента ответа
            if (contentType && contentType.includes('application/json')) {
                return await response.json();
            } else if (contentType && contentType.includes('text/')) {
                return await response.text();
            } else if (contentType && contentType.includes('application/octet-stream')) {
                return await response.blob();
            } else {
                return await response.text(); // По умолчанию возвращаем как текст
            }
        } catch (error) {
            console.error(`Запрос ${method} ${endpoint} не удался:`, error);
            throw error;
        }
    }

    // Метод GET
    async get(endpoint, headers = {}) {
        return this.request('GET', endpoint, null, headers);
    }

    // Метод POST
    async post(endpoint, body, headers = {}) {
        return this.request('POST', endpoint, body, headers);
    }

    // Метод PUT
    async put(endpoint, body, headers = {}) {
        return this.request('PUT', endpoint, body, headers);
    }

    // Метод DELETE
    async delete(endpoint, body = null, headers = {}) {
        return this.request('DELETE', endpoint, body, headers);
    }
}

export default ApiService;
