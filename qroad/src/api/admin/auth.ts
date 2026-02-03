import apiClient from '../client';
import {
    LoginRequest,
} from '@/types/admin';

export const authApi = {
    // 로그인
    login: async (data: LoginRequest): Promise<string> => {
        const response = await apiClient.post('/api/admin/login', data);

        /**
         * 백엔드 응답 형태 정리 (가정)
         * - 토큰이 응답 body에 문자열로 바로 담겨 있음
         *   ex) response.data === 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
         */
        return response.data;
    },
};
