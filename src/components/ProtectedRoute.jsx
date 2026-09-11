import { Navigate, Outlet, useLocation } from 'react-router-dom'
import LoadingState from './ui/LoadingState.jsx'
import { useAuth } from '../hooks/useAuth.js'

export default function ProtectedRoute() {
  const { user, isAuthLoading } = useAuth()
  const location = useLocation()

  // 세션을 확인하는 동안 로그인 화면으로 보내면, 이미 로그인한 사람이
  // 새로고침할 때마다 로그인 화면이 한 번 깜빡인다.
  if (isAuthLoading) return <LoadingState message="확인하는 중입니다." />

  // 가려던 곳을 들고 간다. 로그인에 성공하면 그리로 돌려보낸다.
  if (!user) return <Navigate to="/login" replace state={{ from: location }} />

  return <Outlet />
}
