import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authApi } from '@/api/admin/auth';
import { toast } from 'sonner';
import { LoginRequest } from '@/types/admin';

// 로그인 Hook
export const useLogin = () => {
    const navigate = useNavigate();

    return useMutation({
        mutationFn: (data: LoginRequest) => authApi.login(data),
        onSuccess: (response) => {
            // 세션 정보 저장
            localStorage.setItem('admin_session', response.session);
            localStorage.setItem('adminId', response.adminId);
            localStorage.setItem('pressCompany', response.pressCompany);

            toast.success(`${response.pressCompany}에 로그인했습니다`);
            navigate('/admin/issues');
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
        mutationFn: () => {
            return authApi.logout();
        },
        onSuccess: (response) => {
            // 로컬 스토리지 정리
            localStorage.removeItem('admin_session');
            localStorage.removeItem('adminId');
            localStorage.removeItem('pressCompany');

            toast.success(response.message);
            navigate('/admin/login');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || '로그아웃에 실패했습니다');
        },
    });
};

// 로그인 상태 확인 Hook
export const useAuthStatus = () => {
    const session = localStorage.getItem('admin_session');
    const adminId = localStorage.getItem('adminId');
    const pressCompany = localStorage.getItem('pressCompany');

    return {
        isAuthenticated: !!session && !!adminId,
        adminId,
        pressCompany,
        session,
    };
};
