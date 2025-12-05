import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authApi } from '@/api/admin/auth';
import { toast } from 'sonner';
import { LoginRequest } from '@/types/admin';

// 로그인 Hook
export const useLogin = () => {
    return useMutation({
        mutationFn: (data: LoginRequest) => authApi.login(data),
        onSuccess: (response: any) => {
            console.log('=== 로그인 성공 ===');
            console.log('응답 데이터:', response);

            // 세션 정보 저장 (백엔드 응답 필드명에 맞게 조정)
            const adminId = response.adminId || response.admin_id || response.id || 'admin';
            const pressCompany = response.pressCompany || response.press_company || response.company || '';
            const session = response.session || response.token || response.sessionToken || 'session';

            console.log('추출된 값:', { adminId, pressCompany, session });

            localStorage.setItem('admin_session', session);
            localStorage.setItem('adminId', String(adminId));
            if (pressCompany) {
                localStorage.setItem('pressCompany', pressCompany);
            }

            console.log('localStorage 저장 완료');
            console.log('저장된 값:', {
                session: localStorage.getItem('admin_session'),
                adminId: localStorage.getItem('adminId'),
                pressCompany: localStorage.getItem('pressCompany')
            });

            toast.success(`${pressCompany || adminId}님, 로그인했습니다`);

            console.log('페이지 이동 시작...');
            // 즉시 리다이렉트
            window.location.href = '/admin/issues';
        },
        onError: (error: any) => {
            console.error('=== 로그인 실패 ===');
            console.error('에러:', error);
            console.error('응답:', error.response);
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
            localStorage.removeItem('pressCompany');

            toast.success(response?.message || '로그아웃되었습니다');
            navigate('/admin/login');
        },
        onError: () => {
            // 에러가 발생해도 로컬 정리
            localStorage.removeItem('admin_session');
            localStorage.removeItem('adminId');
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
