import apiClient, { unwrapResponse } from '../client';
import { LoginRequest } from '@/types/admin';

export const authApi = {
    login: async (data: LoginRequest): Promise<string> => {
        const res = await apiClient.post('/api/admin/login', data);
        return unwrapResponse(res) as string;
    },
};
