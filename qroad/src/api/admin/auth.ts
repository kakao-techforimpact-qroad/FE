import apiClient from '../client';
import {
    LoginRequest,
} from '@/types/admin';

export const authApi = {
    // 로그인
    login: async (data: LoginRequest): Promise<string> => {
        // 인터셉터에서 response.data를 반환하므로 여기서는 이미 body(토큰 문자열)
        return apiClient.post('/api/admin/login', data);
    },
};
