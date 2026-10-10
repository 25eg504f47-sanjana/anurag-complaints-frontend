import { Navigate, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import StudentDashboard from './pages/StudentDashboard.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import { useAuth } from './AuthContext.jsx';
import { homePathFor } from './utils.js';

export default function App() {
  const { user, checking } = useAuth();

  if (checking) return <div className="center-screen">Loading…</div>;

  return (
    <>
      <Navbar />
      <main className="container">
        <Routes>
          <Route path="/" element={<Navigate to={user ? homePathFor(user) : '/login'} replace />} />
          <Route path="/login" element={user ? <Navigate to={homePathFor(user)} replace /> : <Login />} />
          <Route path="/register" element={user ? <Navigate to={homePathFor(user)} replace /> : <Register />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute role="STUDENT">
                <StudentDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute role="ADMIN">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<p className="muted">Page not found.</p>} />
        </Routes>
      </main>
    </>
  );
}
