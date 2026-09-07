# b1-2

학습 기록과 회고를 등록하고 완료 상태로 관리하는 React SPA입니다.

## 기술 스택

- React 18 + Vite
- React Router
- Supabase (PostgreSQL)
- Vercel

## 실행 방법

```bash
npm install
npm run dev
```

## 환경변수

`.env.example`을 `.env`로 복사한 뒤 Supabase 프로젝트 값을 채웁니다.

| 이름 | 설명 |
|---|---|
| `VITE_SUPABASE_URL` | Supabase 프로젝트 URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase anon key |
