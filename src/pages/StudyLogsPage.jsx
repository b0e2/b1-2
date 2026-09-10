import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import StudyLogCard from '../components/study-logs/StudyLogCard.jsx'
import Button from '../components/ui/Button.jsx'
import EmptyState from '../components/ui/EmptyState.jsx'
import ErrorState from '../components/ui/ErrorState.jsx'
import LoadingState from '../components/ui/LoadingState.jsx'
import PageHeader from '../components/ui/PageHeader.jsx'
import TagBadge from '../components/ui/TagBadge.jsx'
import { PlusIcon } from '../components/ui/icons.jsx'
import { useStudyLogs } from '../hooks/useStudyLogs.js'

export default function StudyLogsPage() {
  const navigate = useNavigate()
  const { logs, isLoading, error, refetch } = useStudyLogs()
  // 태그 선택은 화면 안에서만 쓰는 상태다.
  // useStudyLogs 에 넘기지 않으므로 선택을 바꿔도 요청이 나가지 않는다.
  const [selectedTag, setSelectedTag] = useState(null)

  const tagOptions = useMemo(() => {
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
  }, [logs])

  const visibleLogs = useMemo(
    () =>
      selectedTag
        ? logs.filter((log) => (log.tags ?? []).some((tag) => tag.toLowerCase() === selectedTag))
        : logs,
    [logs, selectedTag],
  )

  // 상태 판정 순서를 모든 화면에서 똑같이 유지한다.
  // 로딩 → 에러 → 데이터 없음 → 성공.
  function renderBody() {
    if (isLoading) {
      return <LoadingState message="TIL을 불러오는 중입니다." />
    }

    if (error) {
      return (
        <ErrorState
          message="TIL을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요."
          onRetry={refetch}
        />
      )
    }

    // 등록된 기록이 아예 없는 경우와 필터 결과가 없는 경우를 구분한다.
    if (logs.length === 0) {
      return (
        <EmptyState
          title="아직 작성한 TIL이 없습니다."
          description="오늘의 배움을 기록하면 여기에서 확인할 수 있어요."
          actionLabel="새 TIL 작성"
          onAction={() => navigate('/logs/new')}
        />
      )
    }

    if (visibleLogs.length === 0) {
      return (
        <EmptyState
          title="조건에 맞는 TIL이 없습니다."
          description="다른 태그를 골라보세요."
          actionLabel="필터 초기화"
          onAction={() => setSelectedTag(null)}
        />
      )
    }

    return (
      <ul className="log-list">
        {visibleLogs.map((log) => (
          <li key={log.id}>
            <StudyLogCard log={log} onEdit={(target) => navigate(`/logs/${target.id}/edit`)} />
          </li>
        ))}
      </ul>
    )
  }

  return (
    <>
      <PageHeader
        title="학습 목록"
        description="지금까지 기록한 소중한 배움들을 한눈에 확인하고, 언제든지 수정할 수 있어요."
        action={
          <Button variant="primary" onClick={() => navigate('/logs/new')}>
            <PlusIcon />새 TIL 작성
          </Button>
        }
      />
      {tagOptions.length > 0 ? (
        <div className="filter-bar">
          <TagBadge label="전체" selected={!selectedTag} onClick={() => setSelectedTag(null)} />
          {tagOptions.map(({ tag, count }) => (
            <TagBadge
              key={tag}
              tag={tag}
              count={count}
              selected={selectedTag === tag.toLowerCase()}
              onClick={() => setSelectedTag(tag.toLowerCase())}
            />
          ))}
        </div>
      ) : null}

      {renderBody()}
    </>
  )
}
