// 원본 목록에서 화면에 보여줄 값을 계산한다.
// React 를 모르는 순수 함수라 서버에 다시 묻지 않고 화면만 다시 그린다.

function matchesQuery(log, query) {
  if (!query) return true
  const needle = query.toLowerCase()

  return (
    log.title?.toLowerCase().includes(needle) ||
    log.content?.toLowerCase().includes(needle) ||
    log.reflection?.toLowerCase().includes(needle) ||
    (log.tags ?? []).some((tag) => tag.toLowerCase().includes(needle))
  )
}

function matchesTag(log, tag) {
  if (!tag) return true
  const needle = tag.toLowerCase()
  return (log.tags ?? []).some((item) => item.toLowerCase() === needle)
}

export function filterStudyLogs(logs, { query = '', tag = '' } = {}) {
  return logs.filter((log) => matchesQuery(log, query) && matchesTag(log, tag))
}

// 원본 배열을 건드리지 않는다. 정렬 때문에 원본 순서가 바뀌면
// 다른 화면이 기대하는 순서까지 흔들린다.
export function sortStudyLogs(logs, sortOption) {
  const copy = [...logs]

  switch (sortOption) {
    case 'oldest':
      return copy.sort((a, b) => a.study_date.localeCompare(b.study_date))
    case 'longest':
      return copy.sort((a, b) => b.duration_minutes - a.duration_minutes)
    case 'understanding':
      return copy.sort((a, b) => b.understanding - a.understanding)
    default:
      return copy.sort((a, b) => b.study_date.localeCompare(a.study_date))
  }
}

// 대소문자가 다른 같은 태그를 하나로 센다. 표기는 처음 본 것을 남긴다.
export function getTagCounts(logs) {
  const counts = new Map()

  for (const log of logs) {
    for (const tag of log.tags ?? []) {
      const key = tag.toLowerCase()
      const entry = counts.get(key) ?? { tag, count: 0 }
      entry.count += 1
      counts.set(key, entry)
    }
  }

  return [...counts.values()].sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag))
}

export function selectRecentLogs(logs, limit = 5) {
  return sortStudyLogs(logs, 'recent').slice(0, limit)
}
