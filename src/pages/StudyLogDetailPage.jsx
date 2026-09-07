import { useParams } from 'react-router-dom'
import PageHeader from '../components/ui/PageHeader.jsx'

export default function StudyLogDetailPage() {
  const { id } = useParams()

  return <PageHeader title="학습 기록 상세" description={`기록 ${id}`} />
}
