import { useNavigate } from 'react-router-dom'
import StudyLogCard from '../components/study-logs/StudyLogCard.jsx'
import Button from '../components/ui/Button.jsx'
import EmptyState from '../components/ui/EmptyState.jsx'
import ErrorState from '../components/ui/ErrorState.jsx'
import LoadingState from '../components/ui/LoadingState.jsx'
import PageHeader from '../components/ui/PageHeader.jsx'
import { PlusIcon } from '../components/ui/icons.jsx'
import { useStudyLogs } from '../hooks/useStudyLogs.js'

export default function StudyLogsPage() {
  const navigate = useNavigate()
  const { logs, isLoading, error, refetch } = useStudyLogs()

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

    return (
      <ul className="log-list">
        {logs.map((log) => (
          <li key={log.id}>
            <StudyLogCard log={log} />
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
      {renderBody()}
    </>
  )
}
