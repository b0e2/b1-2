import { createContext, useContext } from 'react'

export const ThemeContext = createContext(null)

export function useTheme() {
  const value = useContext(ThemeContext)
  if (!value) throw new Error('useTheme 은 ThemeProvider 안에서만 쓸 수 있습니다.')
  return value
}
