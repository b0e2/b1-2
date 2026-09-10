import { Link } from 'react-router-dom'
import StatusBadge from '../ui/StatusBadge.jsx'
import {
  formatDuration,
  formatStudyDate,
  formatUnderstanding,
} from '../../lib/studyLogFormatters.js'

// compact 는 대시보드처럼 좁은 자리에서 본문 미리보기를 생략할 때 쓴다.
export default function StudyLogCard({ log, compact = false }) {
  return (
    <article className="log-card">
      <div className="log-card__head">
        <Link to={`/logs/${log.id}`} className="log-card__title">
          {log.title}
        </Link>
        <StatusBadge isCompleted={log.is_completed} size="sm" />
      </div>

      <dl className="log-card__meta">
        <div>
          <dt>과목</dt>
          <dd>{log.subject}</dd>
        </div>
        <div>
          <dt>학습일</dt>
          <dd>{formatStudyDate(log.study_date)}</dd>
        </div>
        <div>
          <dt>학습시간</dt>
          <dd>{formatDuration(log.duration_minutes)}</dd>
        </div>
        <div>
          <dt>이해도</dt>
          <dd>{formatUnderstanding(log.understanding)}</dd>
        </div>
      </dl>

      {compact ? null : <p className="log-card__content">{log.content}</p>}
    </article>
  )
}
