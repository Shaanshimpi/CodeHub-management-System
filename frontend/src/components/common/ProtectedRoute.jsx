import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'

const ProtectedRoute = ({redirectPath = '/login' }) => {
  const user = localStorage.getItem('user')
  const isAuthenticated = localStorage.getItem('isAuthenticated')
  const allowedRoles = localStorage.getItem('allowedRoles')
  console.log('ProtectedRoute  allllallla:', { allowedRoles, redirectPath })
  
  console.log('ProtectedRoute:', { isAuthenticated, user, allowedRoles })
  console.log('ProtectedRoute:', useSelector((state) => state.auth))
  
  if (!isAuthenticated) {
    return <Navigate to={redirectPath} replace />
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/unauthorized" replace />
  }

  return <Outlet />
}

export default ProtectedRoute