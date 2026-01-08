# Node Devkit

**노드 개발환경에서 향상된 개발 경험을 제공하는 도구 모음**

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![pnpm](https://img.shields.io/badge/maintained%20with-pnpm-cc00ff.svg)](https://pnpm.io/)
[![Turborepo](https://img.shields.io/badge/built%20with-Turborepo-ef4444.svg)](https://turbo.build/repo)

---

## 📦 Packages

| Package | Version | Description | CI Status |
|---------|---------|-------------|-----------|
| [@scope/feature](./packages/feature) | 0.0.0 | feature 1 | ![CI](https://img.shields.io/github/actions/workflow/status/[repo]?branch=main) |
<!-- | [@scope/react-loop-guard](./packages/react-loop-guard) | ![npm](https://img.shields.io/npm/v/@scope/react-loop-guard) | React 무한루프 감지 및 차단 | ![CI](https://img.shields.io/github/actions/workflow/status/user/repo/ci-loop-guard.yml?branch=main) |
| [@scope/env-tracker](./packages/env-tracker) | ![npm](https://img.shields.io/npm/v/@scope/env-tracker) | 환경변수 변경 추적 및 문서화 | ![CI](https://img.shields.io/github/actions/workflow/status/user/repo/ci-env-tracker.yml?branch=main) |
| [@scope/shared-utils](./packages/shared-utils) | ![npm](https://img.shields.io/npm/v/@scope/shared-utils) | 공통 유틸리티 | ![CI](https://img.shields.io/github/actions/workflow/status/user/repo/ci-shared.yml?branch=main) | -->

> 💡 각 패키지명을 클릭하면 상세 문서로 이동합니다

---

## 🚀 Quick Start

### Installation

<!-- ```bash
# 개별 패키지 설치
pnpm add -D @scope/react-loop-guard

# 또는 yarn
yarn add -D @scope/react-loop-guard

# 또는 npm
npm install -D @scope/react-loop-guard
``` -->
현재 workspace로 연결해둔 상태라 루트 경로에서 해당 앱 패키지에 연결해준다.

```bash
# ~service_root
pnpm install
```

### Basic Usage

추가 예정
<!-- ```tsx
import { LoopGuardProvider } from '@scope/feature';

function App() {
  return (
    <LoopGuardProvider threshold={10}>
      <YourApp />
    </LoopGuardProvider>
  );
}
``` -->

---

## 🛠️ Development

이 레포지토리는 Turborepo를 사용한 모노레포 구조입니다.

### Prerequisites

- Node.js >= 22
- pnpm >= 10

### Setup

```bash
# 저장소 클론
git clone https://github.com/jaemin96/node-devkit.git
cd node-devkit

# 의존성 설치
pnpm install

# 모든 패키지 빌드
pnpm build

# 개발 모드 실행
pnpm dev
```

### Project Structure

```cmd
node-devkit/
├── apps/
│   └── docs/                 # 문서 사이트 (Vitepress/Storybook)
├── packages/
│   ├── react-loop-guard/     # React 무한루프 가드
│   ├── env-tracker/          # ENV 변경 추적기
│   └── shared-utils/         # 공통 유틸리티
├── turbo.json                # Turborepo 설정
├── pnpm-workspace.yaml       # pnpm workspace 설정
└── package.json
```

### Available Scripts

```bash
pnpm build        # 모든 패키지 빌드
pnpm dev          # 개발 모드
pnpm test         # 모든 테스트 실행
pnpm lint         # 린트 검사
pnpm format       # 코드 포맷팅
pnpm changeset    # 변경사항 기록 (배포용)
```

---

## 📚 Documentation

각 패키지의 상세 문서:

- [React Loop Guard](./packages/react-loop-guard/README.md) - 무한루프 감지 및 원인 분석
- [ENV Tracker](./packages/env-tracker/README.md) - 환경변수 변경 히스토리 관리
- [Shared Utils](./packages/shared-utils/README.md) - 공통 유틸리티 함수

---

## 🤝 Contributing

기여는 언제나 환영합니다!

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Commit Convention

이 프로젝트는 [Conventional Commits](https://www.conventionalcommits.org/) 규칙을 따릅니다.

```
feat: 새로운 기능 추가
fix: 버그 수정
docs: 문서 수정
style: 코드 포맷팅, 세미콜론 등
refactor: 코드 리팩토링
test: 테스트 코드
chore: 빌드, 패키지 매니저 수정
```

---

## 📄 License

MIT © [Your Name]

---

## 🔗 Links

- [Documentation](https://your-docs-site.com)
- [npm Organization](https://www.npmjs.com/org/scope)
- [GitHub Discussions](https://github.com/your-org/node-devkit/discussions)
- [Issue Tracker](https://github.com/your-org/node-devkit/issues)

---

<div align="center">

Made with ❤️ by developers, for developers

</div>
