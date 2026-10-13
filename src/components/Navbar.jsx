import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext.jsx';
import { homePathFor, label } from '../utils.js';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to={user ? homePathFor(user) : '/login'} className="brand">
          <span className="brand-mark">AU</span>
          <span>
            Sanjana University
            <small>Complaint Management</small>
          </span>
        </Link>
        <nav className="nav-actions">
          {user ? (
            <>
              <span className="nav-user">
                {user.name} <em>{label(user.role)}</em>
              </span>
              <button className="btn btn-ghost" onClick={handleLogout}>
                Log out
              </button>
            </>
          ) : (
            <>
              <Link className="nav-link" to="/login">
                Log in
              </Link>
              <Link className="btn btn-accent" to="/register">
                Register
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
