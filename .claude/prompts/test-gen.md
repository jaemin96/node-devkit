# 테스트 생성

다음 코드에 대한 테스트를 작성해주세요.

## 테스트 타입

- [ ] Happy path (정상 케이스)
- [ ] Error handling (에러 케이스)
- [ ] Edge cases (경계값)

## Frontend (Jest + RTL)

```typescript
describe('ComponentName', () => {
  it('renders correctly', () => {});
  it('handles user click', () => {});
  it('shows error state', () => {});
});
```

## Backend (Jest)

```typescript
describe('ServiceName', () => {
  it('should create user successfully', () => {});
  it('should throw error when email exists', () => {});
});
```

## 원칙

- 명확한 테스트명
- Given-When-Then 패턴
- 독립적으로 실행 가능
