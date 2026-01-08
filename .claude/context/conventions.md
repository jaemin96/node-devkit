# 코딩 컨벤션

## 네이밍

- 파일: `kebab-case.tsx`
- 컴포넌트: `PascalCase`
- 함수/변수: `camelCase`
- 상수: `UPPER_SNAKE_CASE`

## React

- Named export 사용 (default export 지양)
- Props는 interface로 정의
- 'use client'는 필요할 때만

```typescript
interface UserCardProps {
  user: User;
}

export function UserCard({ user }: UserCardProps) {
  return <div>{user.name}</div>;
}
```

## NestJS

- DTO에 class-validator 사용
- Service에 비즈니스 로직
- Controller는 얇게 유지

```typescript
// DTO
export class CreateUserDto {
  @IsEmail()
  email: string;
  
  @IsString()
  name: string;
}
```

## 추후 언어별로 확장 추가 가능

- Description

```typescript
  ~~~ write ~~~
```

## Git 커밋

```bash
feat: 새 기능
fix: 버그 수정
refactor: 리팩토링
docs: 문서 변경
```
