# Vercel 배포 가이드 (qroad.info)

## 1. Vercel 프로젝트 설정

### 도메인 설정
- **프로덕션 도메인**: `qroad.info`
- **API 서버**: `api.qroad.info`

### 환경 변수 설정

Vercel 대시보드 → Settings → Environment Variables에서 설정:

```bash
# 비워두거나 설정하지 않음 (Vercel rewrites 사용)
VITE_API_BASE_URL=
```

**중요**: `VITE_API_BASE_URL`을 비워두면 상대 경로(`/api`)로 요청하고, Vercel rewrites가 자동으로 `https://api.qroad.info/api`로 프록시합니다.

## 2. CORS 처리 방식

### Vercel Rewrites (권장)
`vercel.json`에 설정된 rewrites를 통해 CORS 문제 해결:

```json
{
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "https://api.qroad.info/api/:path*"
    }
  ]
}
```

**작동 방식**:
1. 프론트엔드에서 `/api/admin/login` 요청
2. Vercel이 `https://api.qroad.info/api/admin/login`으로 프록시
3. 같은 도메인(qroad.info)에서 요청하므로 CORS 문제 없음

### 백엔드 CORS 설정 (필수)

백엔드(`api.qroad.info`)에서 다음 도메인 허용:

```
Access-Control-Allow-Origin: https://qroad.info
Access-Control-Allow-Credentials: true
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
```

## 3. 배포 단계

### 3.1 로컬 빌드 테스트

```bash
# 빌드
npm run build

# 프리뷰
npm run preview
```

### 3.2 Vercel 배포

```bash
# 첫 배포
vercel

# 프로덕션 배포
vercel --prod
```

### 3.3 도메인 연결

1. Vercel 대시보드 → Settings → Domains
2. `qroad.info` 추가
3. DNS 설정:
   ```
   A     @       76.76.21.21
   CNAME www     cname.vercel-dns.com
   ```

## 4. 환경별 설정

### 개발 환경 (localhost:3000)
- Vite 프록시 사용 (`vite.config.ts`)
- `/api` → `https://api.qroad.info`

### 프로덕션 (qroad.info)
- Vercel rewrites 사용 (`vercel.json`)
- `/api` → `https://api.qroad.info/api`

## 5. 트러블슈팅

### CORS 에러 발생 시

1. **Vercel rewrites 확인**
   - `vercel.json` 설정 확인
   - Vercel 대시보드에서 배포 로그 확인

2. **백엔드 CORS 설정 확인**
   ```bash
   curl -I https://api.qroad.info/api/admin/login \
     -H "Origin: https://qroad.info"
   ```
   
   응답 헤더에 다음이 포함되어야 함:
   ```
   Access-Control-Allow-Origin: https://qroad.info
   Access-Control-Allow-Credentials: true
   ```

3. **쿠키 전송 확인**
   - `withCredentials: true` 설정 확인 (`src/api/client.ts`)
   - 백엔드에서 `SameSite=None; Secure` 쿠키 설정

### 빌드 에러 발생 시

```bash
# 캐시 삭제
rm -rf node_modules dist
npm install
npm run build
```

## 6. 체크리스트

배포 전 확인사항:

- [ ] `vercel.json` rewrites 설정 확인
- [ ] 환경 변수 설정 (비워두기)
- [ ] 로컬 빌드 성공 확인
- [ ] 백엔드 CORS 설정 확인
- [ ] 도메인 DNS 설정 완료
- [ ] SSL 인증서 자동 발급 확인

## 7. 유용한 명령어

```bash
# Vercel 로그 확인
vercel logs

# 환경 변수 확인
vercel env ls

# 배포 취소
vercel rollback
```
