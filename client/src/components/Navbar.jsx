import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout, isLoggedIn } = useAuth();
  const location = useLocation();

  const navLinks = isLoggedIn
    ? [
        { to: '/dashboard', label: 'Dashboard' },
        { to: '/pos', label: 'POS' },
        { to: '/admin', label: 'Products' },
        { to: '/sales', label: 'Sales' },
        { to: '/inventory', label: 'Inventory' },
        { to: '/finance', label: 'Finance' },
      ]
    : [
        { to: '/#features', label: 'Features' },
        { to: '/#contact', label: 'Contact' },
      ];

  return (
    <nav className="navbar navbar-expand-lg navbar-dark sticky-top" style={{ background: 'var(--primary)' }}>
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/" style={{ letterSpacing: '.5px' }}>
          Aroma <span style={{ color: 'var(--accent)' }}>Lab</span>
        </Link>
        <button className="navbar-toggler" data-bs-toggle="collapse" data-bs-target="#nav">
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="nav">
          <ul className="navbar-nav ms-auto gap-lg-2 align-items-lg-center">
            {navLinks.map((l) => (
              <li className="nav-item" key={l.to}>
                <Link
                  className={`nav-link ${location.pathname === l.to ? 'active fw-bold' : ''}`}
                  to={l.to}
                >
                  {l.label}
                </Link>
              </li>
            ))}
            <li className="nav-item mt-2 mt-lg-0">
              {isLoggedIn ? (
                <button
                  className="nav-link btn btn-outline-light px-3 fw-semibold"
                  onClick={logout}
                >
                  Logout ({user.username})
                </button>
              ) : (
                <Link
                  className="nav-link btn btn-warning text-dark fw-semibold px-3"
                  to="/login"
                >
                  Login
                </Link>
              )}
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
