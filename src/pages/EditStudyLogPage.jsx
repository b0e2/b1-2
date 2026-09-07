import { useParams } from 'react-router-dom'
import PageHeader from '../components/ui/PageHeader.jsx'

export default function EditStudyLogPage() {
  const { id } = useParams()

  return <PageHeader title="학습 기록 수정" description={`기록 ${id}`} />
}
