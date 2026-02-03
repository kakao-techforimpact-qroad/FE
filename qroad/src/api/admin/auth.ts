import apiClient from '../client';
import {
    LoginRequest,
} from '@/types/admin';

export const authApi = {
    // 로그인
    login: async (data: LoginRequest): Promise<string> => {
        const response = await apiClient.post('/api/admin/login', data);
        return response.data.accessToken;
    },
};
