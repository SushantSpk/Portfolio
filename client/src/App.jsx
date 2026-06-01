import { Navigate, Route, Routes } from 'react-router-dom'
import PortfolioPage from './pages/PortfolioPage.jsx'
import AdminDashboard from './pages/AdminDashboard.jsx'
import AdminLogin from './pages/AdminLogin.jsx'
import AdminMessages from './pages/AdminMessages.jsx'
import AdminProfile from './pages/AdminProfile.jsx'
import AdminProjects from './pages/AdminProjects.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'

function App() {
  return (
    <Routes>
      <Route path="/" element={<PortfolioPage />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/profile"
        element={
          <ProtectedRoute>
            <AdminProfile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/projects"
        element={
          <ProtectedRoute>
            <AdminProjects />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/messages"
        element={
          <ProtectedRoute>
            <AdminMessages />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
