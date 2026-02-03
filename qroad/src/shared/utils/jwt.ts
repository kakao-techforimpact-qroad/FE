type JwtPayload = {
  loginId: string;
  exp?: number;
  iat?: number;
};

export function getLoginIdFromToken(token: string): string | null {
  try {
    const payloadBase64 = token.split('.')[1];
    const decoded = atob(payloadBase64);
    const payload: JwtPayload = JSON.parse(decoded);

    return payload.loginId ?? null;
  } catch (error) {
    console.error('JWT 파싱 실패:', error);
    return null;
  }
}
