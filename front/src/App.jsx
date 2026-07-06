import { Routes, Route, Navigate } from 'react-router-dom'
import AuthPage from './pages/AuthPage'
import DashboardPage from './pages/DashboardPage'
import OperationListPage from './pages/OperationListPage'
import OperationFormPage from './pages/OperationFormPage'
import CategoryPage from './pages/CategoryPage'
import PrivateRoute from './components/PrivateRoute'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<AuthPage />} />
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <DashboardPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/operations"
        element={
          <PrivateRoute>
            <OperationListPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/operations/new"
        element={
          <PrivateRoute>
            <OperationFormPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/categories"
        element={
          <PrivateRoute>
            <CategoryPage />
          </PrivateRoute>
        }
      />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

export default App
