# 프로젝트 개요

## 기술 스택

- **Frontend**: Next.js 14, React 18, TypeScript, TailwindCSS
- **Backend**: NestJS, PostgreSQL, Prisma
- **상태관리**: React Query
- **인증**: JWT

## 폴더 구조

```bash
src/
├── app/           # Next.js pages
├── components/    # React 컴포넌트
├── hooks/         # Custom hooks
└── lib/           # 유틸리티

backend/
└── src/
    ├── modules/   # NestJS 모듈
    └── common/    # 공통 유틸
```

## 핵심 원칙

- Server Component 우선 사용
- 함수형 컴포넌트 + Hooks
- TypeScript strict 모드
- API는 RESTful 설계
