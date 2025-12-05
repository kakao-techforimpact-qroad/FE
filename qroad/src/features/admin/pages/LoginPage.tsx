import { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Sparkles } from 'lucide-react';
import { useLogin } from '@/hooks/admin/useAuth';

export const LoginPage = () => {
    const [loginId, setLoginId] = useState('');
    const [password, setPassword] = useState('');

    const loginMutation = useLogin();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('=== 로그인 폼 제출 ===');
        console.log('입력 데이터:', { loginId, password: '***' });

        loginMutation.mutate({
            loginId: loginId,
            password: password,
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-100 via-purple-50 to-violet-100 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md"
            >
                <Card className="shadow-2xl shadow-purple-500/20 border-purple-200/50">
                    <CardHeader className="space-y-4">
                        <motion.div
                            className="flex items-center justify-center gap-3"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                        >
                            <motion.div
                                className="w-12 h-12 bg-gradient-to-br from-purple-600 to-violet-600 rounded-xl flex items-center justify-center shadow-lg"
                                animate={{
                                    rotate: [0, 5, -5, 0],
                                    scale: [1, 1.05, 1],
                                }}
                                transition={{
                                    duration: 3,
                                    repeat: Infinity,
                                    repeatType: "reverse",
                                }}
                            >
                                <Sparkles className="w-6 h-6 text-white" />
                            </motion.div>
                            <CardTitle className="text-2xl bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent">
                                QRoad Admin
                            </CardTitle>
                        </motion.div>
                        <CardDescription className="text-center">
                            관리자 로그인
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="loginId">아이디</Label>
                                <Input
                                    id="loginId"
                                    type="text"
                                    placeholder="아이디를 입력하세요"
                                    value={loginId}
                                    onChange={(e) => setLoginId(e.target.value)}
                                    className="border-purple-200 focus:border-purple-400 focus:ring-purple-400"
                                    required
                                    disabled={loginMutation.isPending}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">비밀번호</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="비밀번호를 입력하세요"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="border-purple-200 focus:border-purple-400 focus:ring-purple-400"
                                    required
                                    disabled={loginMutation.isPending}
                                />
                            </div>
                            <Button
                                type="submit"
                                disabled={loginMutation.isPending}
                                className="w-full bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white"
                            >
                                {loginMutation.isPending ? '로그인 중...' : '로그인'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
};
