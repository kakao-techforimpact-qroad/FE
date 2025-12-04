import apiClient from '../client';
import {
    LoginRequest,
    LoginResponse,
    LogoutResponse,
} from '@/types/admin';

export const authApi = {
    // 로그인
    login: async (data: LoginRequest): Promise<LoginResponse> => {
        return apiClient.post('/api/admin/login', data);
    },

    // 로그아웃 (Request Body 없음)
    logout: async (): Promise<LogoutResponse> => {
        return apiClient.post('/api/admin/logout');
    },
};
