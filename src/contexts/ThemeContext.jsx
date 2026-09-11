import { useEffect, useMemo, useState } from 'react'
import { ThemeContext } from '../hooks/useTheme.js'

const STORAGE_KEY = 'til-theme'
const PREFERENCES = ['light', 'dark', 'system']

function readStored() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return PREFERENCES.includes(stored) ? stored : 'system'
  } catch {
    // 시크릿 모드 등에서 저장소 접근이 막힐 수 있다. 기본값으로 넘어간다.
    return 'system'
  }
}

export function ThemeProvider({ children }) {
  // 초기값을 함수로 넘긴다. 매 렌더마다 저장소를 읽지 않기 위해서다.
  const [preference, setPreference] = useState(readStored)
  const [systemTheme, setSystemTheme] = useState(() =>
    window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light',
  )

  // 시스템을 고른 경우에만 기기 설정 변화를 따라간다.
  // 구독을 걷지 않으면 화면을 떠난 뒤에도 계속 상태를 바꾸려 한다.
  useEffect(() => {
    const media = window.matchMedia?.('(prefers-color-scheme: dark)')
    if (!media) return undefined

    const handleChange = (event) => setSystemTheme(event.matches ? 'dark' : 'light')
    media.addEventListener('change', handleChange)
    return () => media.removeEventListener('change', handleChange)
  }, [])

  const resolvedTheme = preference === 'system' ? systemTheme : preference

  // 실제 적용은 토큰을 바꾸는 것뿐이다. 문서에 속성 하나만 세운다.
  useEffect(() => {
    document.documentElement.dataset.theme = resolvedTheme
  }, [resolvedTheme])

  const value = useMemo(
    () => ({
      preference,
      resolvedTheme,
      setPreference: (next) => {
        setPreference(next)
        try {
          localStorage.setItem(STORAGE_KEY, next)
        } catch {
          // 저장에 실패해도 이번 방문에는 적용된다.
        }
      },
    }),
    [preference, resolvedTheme],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
