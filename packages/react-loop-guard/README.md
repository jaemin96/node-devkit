# @repo/react-loop-guard

React useEffect 무한루프를 감지하고 차단하는 개발 도구입니다.

## 기능

- useEffect 무한루프 자동 감지
- 렌더링 무한루프 자동 감지
- 루프 원인 분석 및 해결 방법 제시
- 시각적 경고 UI 제공
- 개발 모드 전용 (프로덕션에 영향 없음)

## 설치

```bash
pnpm install
```

## 사용 방법

### 1. Provider 설정

앱의 최상위 컴포넌트를 `LoopGuardProvider`로 감싸주세요.

```tsx
import { LoopGuardProvider, LoopAlert } from '@repo/react-loop-guard';

function App() {
  return (
    <LoopGuardProvider>
      <LoopAlert />
      <YourApp />
    </LoopGuardProvider>
  );
}
```

### 2. Hook 사용

컴포넌트에서 `useLoopGuard`를 사용하여 무한루프를 추적합니다.

```tsx
import { useLoopGuard } from '@repo/react-loop-guard';

function MyComponent() {
  useLoopGuard({
    componentName: 'MyComponent',
    trackRender: true,
    trackEffect: true
  });

  // 나머지 컴포넌트 로직...
}
```

### 3. useEffect 보호

`useGuardedEffect`를 사용하여 특정 useEffect를 보호할 수 있습니다.

```tsx
import { useGuardedEffect } from '@repo/react-loop-guard';

function MyComponent() {
  useGuardedEffect(
    () => {
      // 이펙트 로직
    },
    [deps],
    'MyComponent',
    'myEffect'
  );
}
```

## 설정 옵션

### LoopGuardProvider Props

- `config`: 감지 설정
  - `timeWindowMs`: 검사할 시간 창 (기본: 1000ms)
  - `maxExecutions`: 허용되는 최대 실행 횟수 (기본: 50회)
  - `enabled`: 감지 활성화 여부 (기본: true)
- `throwOnLoop`: 루프 감지 시 에러를 throw할지 여부 (기본: false)
- `devOnly`: 개발 모드에서만 활성화 (기본: true)

```tsx
<LoopGuardProvider
  config={{
    timeWindowMs: 2000,
    maxExecutions: 100,
  }}
  throwOnLoop={false}
>
  <App />
</LoopGuardProvider>
```

### LoopAlert Props

- `position`: 알림 위치 (기본: 'top-right')
- `maxVisible`: 최대 표시 개수 (기본: 3)
- `style`: 커스텀 스타일
- `className`: 커스텀 클래스

## API

### Core

- `renderMonitor`: 렌더링 및 이펙트 실행 기록 관리
- `loopDetector`: 무한루프 감지 로직
- `loopAnalyzer`: 루프 원인 분석

### Components

- `LoopGuardProvider`: 전역 설정 및 상태 관리 Provider
- `LoopAlert`: 시각적 경고 UI 컴포넌트

### Hooks

- `useLoopGuard`: 범용 루프 감지 Hook
- `useRenderGuard`: 렌더링만 추적하는 Hook
- `useGuardedEffect`: useEffect 보호 Hook
- `useLoopGuardContext`: Provider의 Context 접근 Hook

## 라이선스

MIT
