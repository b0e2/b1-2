import { useCallback, useEffect, useState } from 'react'
import { STUDY_LOGS_TABLE, supabase } from '../lib/supabaseClient.js'

// 학습 기록 전체 목록을 담당한다.
//
// 검색어나 필터를 인자로 받지 않는다. 필터를 받으면 그 값이 effect 의존성에
// 들어가고, 사용자가 한 글자 칠 때마다 원격 요청이 나가기 때문이다.
// 목록은 한 번 받아 두고 걸러내는 일은 화면에서 한다.
//
// Context 로 끌어올리지 않고 대시보드·목록·통계가 각각 호출한다.
// 그래야 화면마다 자기 로딩·에러·재시도 상태를 갖는다.
export function useStudyLogs() {
  const [logs, setLogs] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [reloadKey, setReloadKey] = useState(0)

  const refetch = useCallback(() => {
    setReloadKey((key) => key + 1)
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    let active = true

    async function loadStudyLogs() {
      setIsLoading(true)
      setError(null)

      const { data, error: requestError } = await supabase
        .from(STUDY_LOGS_TABLE)
        .select('*')
        .order('study_date', { ascending: false })
        .order('created_at', { ascending: false })
        .abortSignal(controller.signal)

      // 화면을 벗어났거나 재조회로 이 요청이 밀려난 경우다.
      // 중단은 사용자 잘못이 아니므로 오류로 표시하지 않는다.
      if (!active || controller.signal.aborted) return

      if (requestError) {
        setError(requestError)
        setLogs([])
      } else {
        setLogs(data ?? [])
      }
      setIsLoading(false)
    }

    loadStudyLogs()

    return () => {
      active = false
      controller.abort()
    }
  }, [reloadKey])

  return { logs, isLoading, error, refetch }
}
