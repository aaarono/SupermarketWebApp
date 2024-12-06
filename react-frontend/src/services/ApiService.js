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

        // Определяем базовые параметры
        const options = {
            method: method.toUpperCase(),
            headers: {
                ...this.defaultHeaders,
                ...headers,
            },
        };

        // Если передан объект FormData, удаляем Content-Type, чтобы fetch добавил его автоматически
        if (body instanceof FormData) {
            delete options.headers['Content-Type'];
            options.body = body;
        } else if (body) {
            options.body = JSON.stringify(body);
        }

        try {
            const response = await fetch(url, options);

            // Проверка успешности ответа
            const contentType = response.headers.get('content-type');
            if (!response.ok) {
                let errorDetails = '';
                if (contentType && contentType.includes('application/json')) {
                    const errorData = await response.json();
                    errorDetails = errorData.message || JSON.stringify(errorData);
                } else {
                    errorDetails = await response.text();
                }
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
                return await response.text();
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
