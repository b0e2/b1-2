import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronDownIcon, MenuIcon, SearchIcon } from './ui/icons.jsx'
import { buildGlobalSearchPath } from '../lib/searchParams.js'
import { useAuth } from '../hooks/useAuth.js'

// 상단 고정 영역. 전역 검색과 사용자 표시를 담당한다.
// 내비게이션 책임은 Sidebar 로 옮겼다.
//
// 검색은 여기서 원격 조회하지 않는다. Header 가 데이터를 조회하면
// 목록 화면과 별개의 요청이 하나 더 생기고, 타이핑마다 요청이 나가게 된다.
// 제출하면 목록 화면으로 이동만 시키고 조회는 그 화면의 훅이 한다.
export default function Header({ onOpenNav }) {
  const navigate = useNavigate()
  const [term, setTerm] = useState('')
  const { displayName, initials } = useAuth()

  function handleSubmit(event) {
    event.preventDefault()
    navigate(buildGlobalSearchPath(term))
  }

  return (
    <header className="app-header">
      <button
        type="button"
        className="app-header__menu"
        onClick={onOpenNav}
        aria-label="메뉴 열기"
      >
        <MenuIcon />
      </button>

      <form className="app-header__search" role="search" onSubmit={handleSubmit}>
        <label htmlFor="global-search" className="sr-only">
          학습 기록 검색
        </label>
        <SearchIcon />
        <input
          id="global-search"
          type="search"
          value={term}
          onChange={(event) => setTerm(event.target.value)}
          placeholder="궁금한 내용을 검색해보세요. (예: React, 상태관리, 프로그래밍 …)"
        />
      </form>

      <button type="button" className="app-header__user" onClick={() => navigate('/settings')}>
        <span className="avatar" aria-hidden="true">
          {initials}
        </span>
        <span className="app-header__user-name">{displayName}</span>
        <ChevronDownIcon />
      </button>
    </header>
  )
}
