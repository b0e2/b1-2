const UNDERSTANDING_LABELS = {
  1: '거의 이해 못함',
  2: '조금 이해함',
  3: '보통',
  4: '잘 이해함',
  5: '설명할 수 있음',
}

export function formatStudyDate(value, locale = 'ko-KR') {
  if (!value) return ''
  // study_date 는 date 타입이라 시간대 변환 없이 문자열 그대로 다룬다.
  const [year, month, day] = value.split('-').map(Number)
  return new Date(year, month - 1, day).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function formatDateTime(value, locale = 'ko-KR') {
  if (!value) return ''
  return new Date(value).toLocaleString(locale, {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
}

export function formatDuration(minutes) {
  const total = Number(minutes)
  if (!Number.isFinite(total)) return ''
  const hours = Math.floor(total / 60)
  const rest = total % 60
  if (hours && rest) return `${hours}시간 ${rest}분`
  if (hours) return `${hours}시간`
  return `${rest}분`
}

export function formatUnderstanding(value) {
  return UNDERSTANDING_LABELS[value] ?? '-'
}

export function formatCompletionStatus(isCompleted) {
  return isCompleted ? '완료' : '진행 중'
}
