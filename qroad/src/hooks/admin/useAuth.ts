import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authApi } from '@/api/admin/auth';
import { toast } from 'sonner';
import { LoginRequest } from '@/types/admin';

// 로그인 Hook
export const useLogin = () => {
    const navigate = useNavigate();

    return useMutation({
        // authApi.login은 토큰 문자열을 반환함
        mutationFn: (data: LoginRequest) => authApi.login(data),
        onSuccess: (token: string) => {
            if (token && typeof token === 'string') {
                // 1. JWT 저장
                localStorage.setItem('accessToken', token);

                toast.success('로그인되었습니다');
                navigate('/admin/issues');
            } else {
                console.error('토큰을 찾을 수 없습니다. 응답 값:', token);
                toast.error('로그인 응답 형식이 올바르지 않습니다.');
            }
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || '로그인에 실패했습니다');
        },
    });
};

// 로그아웃 Hook
export const useLogout = () => {
    const navigate = useNavigate();

    return useMutation({
        mutationFn: async () => {
            // 서버에 요청할 필요 없음
            return Promise.resolve();
        },
        onSuccess: () => {
            localStorage.removeItem('accessToken');
            toast.success('로그아웃되었습니다');
            navigate('/admin/login');
        },
    });
};

// 로그인 상태 확인 Hook
export const useAuthStatus = () => {
    const token = localStorage.getItem('accessToken');

    return {
        isAuthenticated: !!token,
    };
};