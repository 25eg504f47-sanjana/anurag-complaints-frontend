import { Navigate } from 'react-router-dom';
import { useAuth } from '../AuthContext.jsx';
import { homePathFor } from '../utils.js';

export default function ProtectedRoute({ role, children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to={homePathFor(user)} replace />;
  return children;
}
