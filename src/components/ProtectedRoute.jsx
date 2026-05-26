import { Navigate, useLocation } from 'react-router-dom'
import { useApp } from '../contexts/AppContext'

export default function ProtectedRoute({ children }) {
  const { user } = useApp()
  const location = useLocation()

  // null = auth session still loading — render nothing to avoid flash
  if (user === null) return null

  // no id = guest / not logged in
  if (!user.id) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
}
