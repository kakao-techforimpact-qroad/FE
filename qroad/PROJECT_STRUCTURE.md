# 프로젝트 구조

## 폴더 구조

```
qroad/
├── src/
│   ├── app/                    # 애플리케이션 진입점 및 라우팅
│   │   ├── main.tsx           # React 앱 진입점
│   │   └── router.tsx         # React Router 설정
│   │
│   ├── features/              # 기능별 모듈 (Feature-based 구조)
│   │   ├── admin/             # 관리자 기능
│   │   │   ├── components/    # 관리자 전용 컴포넌트
│   │   │   ├── hooks/         # 관리자 전용 훅
│   │   │   └── pages/         # 관리자 페이지
│   │   │       ├── AdminDashboard.tsx
│   │   │       └── ArticleManagePage.tsx
│   │   │
│   │   └── user/              # 사용자 기능
│   │       ├── components/    # 사용자 전용 컴포넌트
│   │       ├── hooks/         # 사용자 전용 훅
│   │       ├── pages/         # 사용자 페이지
│   │       │   ├── ArticleListPage.tsx
│   │       │   └── ArticleDetailPage.tsx
│   │       └── types/         # 사용자 관련 타입 정의
│   │
│   ├── shared/                # 공유 리소스
│   │   ├── components/        # 공유 컴포넌트
│   │   │   ├── Layout/        # 레이아웃 컴포넌트
│   │   │   │   ├── AdminLayout.tsx
│   │   │   │   └── UserLayout.tsx
│   │   │   └── ui/           # UI 컴포넌트 라이브러리 (shadcn/ui)
│   │   │       ├── button.tsx
│   │   │       ├── card.tsx
│   │   │       └── ... (기타 UI 컴포넌트)
│   │   ├── hooks/            # 공유 훅
│   │   └── utils/            # 유틸리티 함수
│   │       └── cn.ts          # className 병합 유틸리티
│   │
│   ├── mock/                  # Mock 데이터
│   │   └── articles.mock.ts
│   │
│   └── styles/                # 전역 스타일
│       └── global.css         # 전역 CSS 및 테마 변수
│
├── public/                     # 정적 파일
├── index.html                  # HTML 진입점
└── package.json
```

## 주요 디렉토리 설명

### `src/app/`
- 애플리케이션의 진입점과 라우팅 설정
- `main.tsx`: React 앱 초기화 및 프로바이더 설정
- `router.tsx`: React Router 라우트 정의

### `src/features/`
- 기능별로 모듈화된 코드 (Feature-based Architecture)
- 각 feature는 독립적인 `components`, `hooks`, `pages`를 가질 수 있음
- `admin`: 관리자 전용 기능
- `user`: 사용자 전용 기능

### `src/shared/`
- 여러 feature에서 공유하는 리소스
- `components/Layout`: 레이아웃 컴포넌트
- `components/ui`: 재사용 가능한 UI 컴포넌트 (shadcn/ui 기반)
- `utils`: 유틸리티 함수

### `src/mock/`
- 개발 및 테스트용 Mock 데이터

### `src/styles/`
- 전역 스타일 및 CSS 변수 정의
- Tailwind CSS 설정 포함

## 네이밍 컨벤션

- **컴포넌트**: PascalCase (예: `AdminLayout.tsx`)
- **훅**: camelCase with `use` prefix (예: `useArticle.ts`)
- **유틸리티**: camelCase (예: `cn.ts`)
- **타입**: PascalCase (예: `Article.ts`)

## Import 경로 별칭

- `@/` → `src/`
- `@/shared/` → `src/shared/`
- `@/features/` → `src/features/`

