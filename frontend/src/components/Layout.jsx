import { Link, useLocation } from 'react-router-dom';
import './Layout.css';

function Layout({ children }) {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <div className="layout">
      <nav className="navbar">
        <div className="nav-container">
          <Link to="/" className="nav-brand">
            Machine Manager
          </Link>
          <div className="nav-links">
            <Link 
              to="/" 
              className={`nav-link ${isActive('/') ? 'active' : ''}`}
            >
              Home
            </Link>
            <Link 
              to="/machines" 
              className={`nav-link ${isActive('/machines') ? 'active' : ''}`}
            >
              Machines
            </Link>
            <Link 
              to="/maintenance" 
              className={`nav-link ${isActive('/maintenance') ? 'active' : ''}`}
            >
              Maintenance
            </Link>
            <Link 
              to="/usage-logs" 
              className={`nav-link ${isActive('/usage-logs') ? 'active' : ''}`}
            >
              Usage Logs
            </Link>
          </div>
        </div>
      </nav>
      <main className="main-content">
        {children}
      </main>
    </div>
  );
}

export default Layout;

