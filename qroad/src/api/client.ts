import axios from 'axios';

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    timeout: 10000, // 1시간 (3600초)
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, // 쿠키 전송을 위해
});

// Request Interceptor - 세션 추가
apiClient.interceptors.request.use(
    (config) => {
        const session = localStorage.getItem('admin_session');
        if (session) {
            config.headers['Authorization'] = `Bearer ${session}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response Interceptor - 에러 처리
apiClient.interceptors.response.use(
    (response) => response.data,
    (error) => {
        if (error.response?.status === 401) {
            // 인증 실패 시 로그인 페이지로
            localStorage.removeItem('admin_session');
            localStorage.removeItem('adminId');
            localStorage.removeItem('pressCompany');
            window.location.href = '/admin/login';
        }
        return Promise.reject(error);
    }
);

export default apiClient;
