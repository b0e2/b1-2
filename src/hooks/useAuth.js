import { createContext, useContext } from 'react'

// Context 객체를 읽는 쪽에 둔다.
// Provider 와 같은 파일에 두면 그 파일이 컴포넌트와 값을 함께 내보내게 되어
// 개발 중 빠른 새로고침이 동작하지 않는다.
export const AuthContext = createContext(null)

export function useAuth() {
  const value = useContext(AuthContext)
  if (!value) throw new Error('useAuth 는 AuthProvider 안에서만 쓸 수 있습니다.')
  return value
}
