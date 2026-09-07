import { Link, NavLink } from 'react-router-dom'

const NAV_ITEMS = [
  { to: '/', label: '대시보드', end: true },
  { to: '/logs', label: '학습 기록' },
  { to: '/stats', label: '통계' },
]

export default function Header() {
  return (
    <header className="app-header">
      <div className="app-header__inner">
        <Link to="/" className="app-header__brand">
          학습 기록
        </Link>

        <nav className="app-header__nav" aria-label="주요 메뉴">
          {NAV_ITEMS.map(({ to, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                isActive ? 'app-header__link app-header__link--active' : 'app-header__link'
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        <Link to="/logs/new" className="button button--primary button--sm">
          기록 추가
        </Link>
      </div>
    </header>
  )
}
