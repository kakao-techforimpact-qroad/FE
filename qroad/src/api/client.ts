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

// Response Interceptor - 인증 에러 처리 + body만 반환
apiClient.interceptors.response.use(
    (response) => {
        return response.data;
    },
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('accessToken');
            window.location.href = '/admin/login';
        }
        return Promise.reject(error);
    }
);

/** 배포 빌드 등에서 인터셉터 미적용 시 axios 응답 전체가 올 수 있음. body만 추출 */
export function unwrapResponse<T>(res: T | { data: T; status?: number }): T {
    if (res != null && typeof res === 'object' && 'data' in res && 'status' in res) {
        return (res as { data: T }).data;
    }
    return res as T;
}

export default apiClient;
