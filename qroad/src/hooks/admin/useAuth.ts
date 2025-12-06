import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authApi } from '@/api/admin/auth';
import { toast } from 'sonner';
import { LoginRequest } from '@/types/admin';

// 로그인 Hook
export const useLogin = () => {
    return useMutation({
        mutationFn: async (data: LoginRequest) => {
            // 로그인 요청 전에 loginId 저장 (성공 시 사용)
            const response = await authApi.login(data);
            return { ...response, loginId: data.loginId };
        },
        onSuccess: (response: any) => {
            // 세션 정보 저장 (백엔드 응답 필드명에 맞게 조정)
            const adminId = response.adminId || response.admin_id || response.id || 'admin';
            const pressCompany = response.pressCompany || response.press_company || response.company || '';
            const session = response.session || response.token || response.sessionToken || 'session';
            const loginId = response.loginId; // 로그인 시 입력한 ID

            localStorage.setItem('admin_session', session);
            localStorage.setItem('adminId', String(adminId));
            localStorage.setItem('loginId', loginId); // 입력한 loginId 저장
            localStorage.setItem('justLoggedIn', 'true'); // 로그인 직후 플래그
            if (pressCompany) {
                localStorage.setItem('pressCompany', pressCompany);
            }

            // 즉시 페이지 이동
            window.location.href = '/admin/issues';
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
            try {
                return await authApi.logout();
            } catch (error) {
                // API 실패해도 로컬 정리는 진행
                console.warn('로그아웃 API 실패, 로컬 정리만 진행:', error);
                return { message: '로그아웃되었습니다' };
            }
        },
        onSuccess: (response: any) => {
            // 로컬 스토리지 정리
            localStorage.removeItem('admin_session');
            localStorage.removeItem('adminId');
            localStorage.removeItem('loginId');
            localStorage.removeItem('pressCompany');

            toast.success(response?.message || '로그아웃되었습니다');
            navigate('/admin/login');
        },
        onError: () => {
            // 에러가 발생해도 로컬 정리
            localStorage.removeItem('admin_session');
            localStorage.removeItem('adminId');
            localStorage.removeItem('loginId');
            localStorage.removeItem('pressCompany');

            toast.success('로그아웃되었습니다');
            navigate('/admin/login');
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
