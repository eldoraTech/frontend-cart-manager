import { Navigate, Outlet } from 'react-router-dom';
import { isAuthenticated } from '@/lib/firebase';

const ProtectedRoute = () => {
  if (!isAuthenticated()) {
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
