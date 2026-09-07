import { Link } from 'react-router-dom'
import PageHeader from '../components/ui/PageHeader.jsx'

export default function LoginPage() {
  return (
    <main className="app-main app-main--narrow">
      <PageHeader title="로그인" description="학습 기록을 계정에 연결합니다." />
      <Link to="/" className="link">
        대시보드로 이동
      </Link>
    </main>
  )
}
