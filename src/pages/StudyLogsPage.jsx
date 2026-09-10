import { useNavigate } from 'react-router-dom'
import StudyLogCard from '../components/study-logs/StudyLogCard.jsx'
import Button from '../components/ui/Button.jsx'
import EmptyState from '../components/ui/EmptyState.jsx'
import ErrorState from '../components/ui/ErrorState.jsx'
import LoadingState from '../components/ui/LoadingState.jsx'
import PageHeader from '../components/ui/PageHeader.jsx'
import { useStudyLogs } from '../hooks/useStudyLogs.js'

export default function StudyLogsPage() {
  const navigate = useNavigate()
  const { logs, isLoading, error, refetch } = useStudyLogs()

  // 상태 판정 순서를 모든 화면에서 똑같이 유지한다.
  // 로딩 → 에러 → 데이터 없음 → 성공.
  function renderBody() {
    if (isLoading) {
      return <LoadingState message="학습 기록을 불러오는 중입니다." />
    }

    if (error) {
      return (
        <ErrorState
          message="학습 기록을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요."
          onRetry={refetch}
        />
      )
    }

    if (logs.length === 0) {
      return (
        <EmptyState
          title="아직 등록된 학습 기록이 없습니다."
          description="첫 기록을 남기면 여기에서 확인할 수 있습니다."
          actionLabel="기록 등록하기"
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
        title="학습 기록"
        description="등록한 기록을 확인합니다."
        action={
          <Button variant="primary" onClick={() => navigate('/logs/new')}>
            기록 추가
          </Button>
        }
      />
      {renderBody()}
    </>
  )
}
