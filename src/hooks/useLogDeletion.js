import { useCallback, useState } from 'react'

// 삭제 대상 고르기와 확인 흐름을 담는다.
// 네 화면이 같은 상태와 같은 순서를 반복하고 있었다.
export function useLogDeletion(removeLog) {
  const [target, setTarget] = useState(null)

  const confirm = useCallback(async () => {
    if (!target) return
    const removed = await removeLog(target.id)
    // 실패하면 대화상자를 닫지 않는다. 오류를 그 자리에서 보여준다.
    if (removed) setTarget(null)
  }, [target, removeLog])

  return {
    target,
    ask: setTarget,
    cancel: useCallback(() => setTarget(null), []),
    confirm,
  }
}
