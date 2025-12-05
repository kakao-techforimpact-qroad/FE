# Git을 통한 Vercel 배포 가이드

## 1. GitHub 저장소 준비

### 1.1 Git 초기화 (아직 안 했다면)

```bash
cd /Users/jongsookim/Desktop/FE/qroad
git init
git add .
git commit -m "Initial commit: QRoad project"
```

### 1.2 GitHub 저장소 생성 및 연결

1. GitHub에서 새 저장소 생성 (예: `qroad-frontend`)
2. 로컬 저장소와 연결:

```bash
git remote add origin https://github.com/YOUR_USERNAME/qroad-frontend.git
git branch -M main
git push -u origin main
```

## 2. Vercel과 GitHub 연동

### 2.1 Vercel 대시보드에서 설정

1. **Vercel 대시보드 접속**: https://vercel.com/dashboard
2. **"Add New..." → Project** 클릭
3. **"Import Git Repository"** 선택
4. **GitHub 계정 연결** (처음이라면)
5. **저장소 선택**: `qroad-frontend` 선택
6. **Import** 클릭

### 2.2 프로젝트 설정

**Framework Preset**: Vite (자동 감지됨)

**Build Settings**:
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`

**Environment Variables**:
```
VITE_API_BASE_URL = (비워두기)
```

### 2.3 도메인 설정

1. **Settings → Domains**
2. **Add Domain**: `qroad.info` 입력
3. **Add** 클릭
4. DNS 설정 확인 (이미 설정되어 있음)

## 3. 자동 배포 설정

### 3.1 브랜치별 배포

- **main 브랜치**: 프로덕션 배포 (`qroad.info`)
- **develop 브랜치**: 프리뷰 배포 (자동 생성된 URL)
- **기타 브랜치**: PR별 프리뷰 배포

### 3.2 배포 트리거

```bash
# 프로덕션 배포
git add .
git commit -m "Update: feature description"
git push origin main
```

**자동으로**:
1. GitHub에 push
2. Vercel이 자동으로 감지
3. 빌드 시작
4. 성공하면 자동 배포
5. `qroad.info`에 반영

## 4. 배포 확인

### 4.1 Vercel 대시보드에서 확인

- **Deployments** 탭에서 배포 상태 확인
- **Logs** 탭에서 빌드 로그 확인
- **Functions** 탭에서 Serverless Functions 확인 (있다면)

### 4.2 배포 URL

- **프로덕션**: https://qroad.info
- **프리뷰**: https://qroad-frontend-xxx.vercel.app

## 5. 환경 변수 설정

### 5.1 Vercel 대시보드에서 설정

1. **Settings → Environment Variables**
2. **Add New**:
   - Name: `VITE_API_BASE_URL`
   - Value: (비워두기)
   - Environment: Production, Preview, Development 모두 선택
3. **Save**

### 5.2 재배포

환경 변수 변경 후:
1. **Deployments** 탭
2. 최신 배포 선택
3. **... → Redeploy** 클릭

## 6. 트러블슈팅

### 빌드 실패 시

1. **로컬에서 빌드 테스트**:
   ```bash
   npm run build
   ```

2. **Vercel 로그 확인**:
   - Deployments → 실패한 배포 클릭 → Logs 확인

3. **환경 변수 확인**:
   - Settings → Environment Variables 확인

### CORS 에러 시

1. **vercel.json 확인**:
   - rewrites 설정 확인
   - 배포 후 적용되었는지 확인

2. **백엔드 CORS 설정 확인**:
   ```bash
   curl -I https://api.qroad.info/api/admin/login \
     -H "Origin: https://qroad.info"
   ```

## 7. Git 워크플로우

### 7.1 기능 개발

```bash
# 새 브랜치 생성
git checkout -b feature/new-feature

# 개발 및 커밋
git add .
git commit -m "Add: new feature"

# GitHub에 push
git push origin feature/new-feature
```

→ Vercel이 자동으로 프리뷰 배포 생성

### 7.2 프로덕션 배포

```bash
# main 브랜치로 이동
git checkout main

# 최신 변경사항 병합
git merge feature/new-feature

# 프로덕션 배포
git push origin main
```

→ Vercel이 자동으로 `qroad.info`에 배포

## 8. 체크리스트

배포 전 확인:

- [ ] GitHub 저장소 생성 및 코드 push
- [ ] Vercel과 GitHub 저장소 연동
- [ ] 환경 변수 설정 (`VITE_API_BASE_URL` 비워두기)
- [ ] 도메인 설정 (`qroad.info`)
- [ ] 로컬 빌드 테스트 성공
- [ ] main 브랜치에 push하여 배포

## 9. 유용한 링크

- **Vercel 대시보드**: https://vercel.com/dashboard
- **Vercel Git 문서**: https://vercel.com/docs/git
- **배포 상태 확인**: https://vercel.com/YOUR_USERNAME/qroad-frontend
