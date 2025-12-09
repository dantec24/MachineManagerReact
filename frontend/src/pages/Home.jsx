import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { maintenanceService, usageLogService } from '../services/api';
import { exportDashboardToPDF } from '../services/pdfExport';
import './Home.css';

function Home() {
  const [recentMaintenance, setRecentMaintenance] = useState([]);
  const [recentUsageLogs, setRecentUsageLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentActivity = async () => {
      try {
        setLoading(true);
        const [maintenanceRes, usageLogsRes] = await Promise.all([
          maintenanceService.getAll(),
          usageLogService.getAll()
        ]);
        
        // Get the 5 most recent maintenance records
        setRecentMaintenance(maintenanceRes.data.slice(0, 5));
        // Get the 5 most recent usage logs
        setRecentUsageLogs(usageLogsRes.data.slice(0, 5));
      } catch (error) {
        console.error('Error fetching recent activity:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentActivity();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleExportDashboard = () => {
    exportDashboardToPDF(recentMaintenance, recentUsageLogs);
  };

  return (
    <div className="home">
      <div className="home-hero">
        <h1>Machine Manager</h1>
        <p className="home-subtitle">
          Track and manage your equipment, maintenance records, and usage logs
        </p>
      </div>

      {/* Dashboard Section */}
      <div className="dashboard">
        <div className="dashboard-header">
          <h2 className="dashboard-title">Recent Activity</h2>
          <button onClick={handleExportDashboard} className="btn btn-export">
            📄 Export Dashboard PDF
          </button>
        </div>
        
        {loading ? (
          <div className="dashboard-loading">Loading recent activity...</div>
        ) : (
          <div className="dashboard-grid">
            {/* Recent Maintenance */}
            <div className="dashboard-card">
              <div className="dashboard-card-header">
                <h3>🔨 Recent Maintenance</h3>
                <Link to="/maintenance" className="dashboard-link">View All</Link>
              </div>
              {recentMaintenance.length === 0 ? (
                <div className="dashboard-empty">No maintenance records yet</div>
              ) : (
                <div className="dashboard-list">
                  {recentMaintenance.map((record) => (
                    <div key={record.Id} className="dashboard-item">
                      <div className="dashboard-item-main">
                        <div className="dashboard-item-title">{record.MachineName || 'Unknown Machine'}</div>
                        <div className="dashboard-item-subtitle">{record.Type}</div>
                        <div className="dashboard-item-description">{record.Description}</div>
                      </div>
                      <div className="dashboard-item-meta">
                        <div className="dashboard-item-date">{formatDate(record.PerformedDate)}</div>
                        <div className="dashboard-item-cost">${record.Cost?.toFixed(2) || '0.00'}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recent Usage Logs */}
            <div className="dashboard-card">
              <div className="dashboard-card-header">
                <h3>📊 Recent Usage Logs</h3>
                <Link to="/usage-logs" className="dashboard-link">View All</Link>
              </div>
              {recentUsageLogs.length === 0 ? (
                <div className="dashboard-empty">No usage logs yet</div>
              ) : (
                <div className="dashboard-list">
                  {recentUsageLogs.map((log) => (
                    <div key={log.Id} className="dashboard-item">
                      <div className="dashboard-item-main">
                        <div className="dashboard-item-title">{log.MachineName || 'Unknown Machine'}</div>
                        <div className="dashboard-item-subtitle">{log.JobDescription}</div>
                        <div className="dashboard-item-description">Operator: {log.OperatorName}</div>
                      </div>
                      <div className="dashboard-item-meta">
                        <div className="dashboard-item-date">{formatDateTime(log.StartTime)}</div>
                        <div className="dashboard-item-hours">{log.HoursUsed?.toFixed(1) || '0'} hrs</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
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

