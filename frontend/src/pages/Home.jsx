import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
  return (
    <div className="home">
      <div className="home-hero">
        <h1>Machine Manager</h1>
        <p className="home-subtitle">
          Track and manage your equipment, maintenance records, and usage logs
        </p>
      </div>

      <div className="home-cards">
        <Link to="/machines" className="home-card">
          <div className="home-card-icon">🔧</div>
          <h2>Machines</h2>
          <p>View and manage all your machines</p>
        </Link>

        <Link to="/maintenance" className="home-card">
          <div className="home-card-icon">🔨</div>
          <h2>Maintenance</h2>
          <p>Track maintenance records and schedules</p>
        </Link>

        <Link to="/usage-logs" className="home-card">
          <div className="home-card-icon">📊</div>
          <h2>Usage Logs</h2>
          <p>Monitor machine usage and hours</p>
        </Link>
      </div>

      <div className="home-actions">
        <Link to="/machines/create" className="btn btn-primary">
          Add New Machine
        </Link>
      </div>
    </div>
  );
}

export default Home;

