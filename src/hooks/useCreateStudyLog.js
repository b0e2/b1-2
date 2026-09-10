import { useCallback, useEffect, useRef, useState } from 'react'
import { STUDY_LOGS_TABLE, supabase } from '../lib/supabaseClient.js'

// 등록 요청만 담당한다.
// 목록 조회와 생명주기가 달라 useStudyLogs 와 나눈다.
// 조회 effect 가 없고, 성공 직후 화면을 떠나므로 마운트 여부만 추적한다.
export function useCreateStudyLog() {
  const [isCreating, setIsCreating] = useState(false)
  const [createError, setCreateError] = useState(null)
  const mounted = useRef(true)

  useEffect(() => {
    mounted.current = true
    return () => {
      mounted.current = false
    }
  }, [])

  const clearCreateError = useCallback(() => setCreateError(null), [])

  const createLog = useCallback(async (values) => {
    if (mounted.current) {
      setIsCreating(true)
      setCreateError(null)
    }

    const { data, error } = await supabase
      .from(STUDY_LOGS_TABLE)
      .insert(values)
      .select()
      .single()

    if (mounted.current) setIsCreating(false)

    if (error) {
      if (mounted.current) setCreateError(error)
      throw new Error('저장하지 못했습니다. 입력값을 확인하고 다시 시도해 주세요.')
    }

    return data
  }, [])

  return { createLog, isCreating, createError, clearCreateError }
}
