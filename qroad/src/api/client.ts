import axios from 'axios';

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    timeout: 300000, // 5분 (300초)
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request Interceptor - JWT 추가
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response Interceptor - 인증 에러 처리
apiClient.interceptors.response.use(
    (response) => {
        return response; 
    },
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('accessToken');
            window.location.href = '/admin/login';
        }
        return Promise.reject(error);
    }
);

export default apiClient;
