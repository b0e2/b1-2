import { Route, Routes } from 'react-router-dom'
import AppLayout from './components/AppLayout.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import { AuthProvider } from './contexts/AuthContext.jsx'
import { ThemeProvider } from './contexts/ThemeContext.jsx'
import DashboardPage from './pages/DashboardPage.jsx'
import EditStudyLogPage from './pages/EditStudyLogPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import NewStudyLogPage from './pages/NewStudyLogPage.jsx'
import NotFoundPage from './pages/NotFoundPage.jsx'
import StatsPage from './pages/StatsPage.jsx'
import StudyLogDetailPage from './pages/StudyLogDetailPage.jsx'
import SettingsPage from './pages/SettingsPage.jsx'
import StudyLogsPage from './pages/StudyLogsPage.jsx'
import TagsPage from './pages/TagsPage.jsx'

// 공통 레이아웃 안쪽에는 헤더 내비게이션이 필요한 화면만 둔다.
// 로그인과 NotFound는 내비게이션 없이 단독으로 보여야 하므로 바깥에 둔다.
//
// 기록을 다루는 화면은 모두 로그인이 필요하다.
// 로그인 화면과 NotFound 는 보호 바깥에 둔다.
export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/logs" element={<StudyLogsPage />} />
              <Route path="/logs/new" element={<NewStudyLogPage />} />
              <Route path="/logs/:id" element={<StudyLogDetailPage />} />
              <Route path="/logs/:id/edit" element={<EditStudyLogPage />} />
              <Route path="/tags" element={<TagsPage />} />
              <Route path="/stats" element={<StatsPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Route>
          </Route>
          <Route path="/login" element={<LoginPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AuthProvider>
    </ThemeProvider>
  )
}
