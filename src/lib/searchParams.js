// 목록 화면의 조회 조건을 주소에서 읽고 쓴다.
// 헤더와 목록이 각자 규칙을 만들면 파라미터 이름이 갈리므로 여기 모은다.
//
// 이 값들은 화면 안에서만 쓰인다. 원격 조회의 의존성에 들어가지 않으므로
// 검색어를 한 글자 칠 때마다 요청이 나가지 않는다.

export const SORT_OPTIONS = [
  { value: 'recent', label: '최신순' },
  { value: 'oldest', label: '오래된순' },
  { value: 'longest', label: '학습시간 긴 순' },
  { value: 'understanding', label: '이해도 높은 순' },
]

const DEFAULT_SORT = 'recent'

export function readLogSearchParams(searchParams) {
  const sort = searchParams.get('sort')

  return {
    query: searchParams.get('q') ?? '',
    tag: searchParams.get('tag') ?? '',
    sort: SORT_OPTIONS.some((option) => option.value === sort) ? sort : DEFAULT_SORT,
  }
}

// 기본값은 주소에 남기지 않는다. 빈 파라미터가 붙은 주소는 공유하기 나쁘다.
export function writeLogSearchParams(current, patch) {
  const next = new URLSearchParams(current)

  const entries = {
    q: patch.query,
    tag: patch.tag,
    sort: patch.sort === DEFAULT_SORT ? '' : patch.sort,
  }

  for (const [key, value] of Object.entries(entries)) {
    if (value === undefined) continue
    if (value) next.set(key, value)
    else next.delete(key)
  }

  return next
}

export function buildGlobalSearchPath(query) {
  const trimmed = String(query ?? '').trim()
  return trimmed ? `/logs?q=${encodeURIComponent(trimmed)}` : '/logs'
}
