import { Link } from 'react-router-dom'
import { PlusIcon } from '../components/ui/icons.jsx'

export default function DashboardPage() {
  return (
    <>
      <section className="hero">
        <p className="hero__eyebrow">A small record, a bigger tomorrow</p>
        <h1 className="hero__title">오늘도, 좋은 배움이에요.</h1>
        <p className="hero__description">
          오늘의 배움을 기록하고,
          <br />더 나은 내일을 만들어가요.
        </p>
        <div className="hero__actions">
          <Link to="/logs/new" className="button button--primary">
            <PlusIcon />새 TIL 작성
          </Link>
          <Link to="/logs" className="button button--secondary">
            학습 목록 보기
          </Link>
        </div>
      </section>
    </>
  )
}
