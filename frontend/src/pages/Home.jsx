import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { machineService, maintenanceService, usageLogService } from '../services/api';
import './Home.css';

function Home() {
  const [stats, setStats] = useState({
    totalMachines: 0,
    totalHours: 0,
    activeMachines: 0,
    recentMaintenance: 0
  });
  const [recentMachines, setRecentMachines] = useState([]);
  const [recentMaintenance, setRecentMaintenance] = useState([]);
  const [recentUsageLogs, setRecentUsageLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch all data in parallel
      const [machinesRes, maintenanceRes, usageLogsRes] = await Promise.all([
        machineService.getAll(),
        maintenanceService.getAll(),
        usageLogService.getAll()
      ]);

      const machines = machinesRes.data;
      const maintenance = maintenanceRes.data;
      const usageLogs = usageLogsRes.data;

      // Calculate statistics
      const totalHours = machines.reduce((sum, m) => sum + (m.OperatingHours || 0), 0);
      const activeMachines = machines.filter(m => m.Status?.toLowerCase() === 'active').length;
      
      // Get recent items (latest 5)
      const recentMachinesList = machines
        .sort((a, b) => new Date(b.CreatedAt) - new Date(a.CreatedAt))
        .slice(0, 5);
      
      const recentMaintenanceList = maintenance.slice(0, 5);
      const recentUsageLogsList = usageLogs.slice(0, 5);

      setStats({
        totalMachines: machines.length,
        totalHours: Math.round(totalHours),
        activeMachines,
        recentMaintenance: maintenance.length
      });

      setRecentMachines(recentMachinesList);
      setRecentMaintenance(recentMaintenanceList);
      setRecentUsageLogs(recentUsageLogsList);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'status-badge status-active';
      case 'inactive':
        return 'status-badge status-inactive';
      case 'maintenance':
        return 'status-badge status-maintenance';
      default:
        return 'status-badge';
    }
  };

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  return (
    <div className="home">
      <div className="home-hero">
        <h1>Machine Manager Dashboard</h1>
        <p className="home-subtitle">
          Overview of your equipment, maintenance, and usage
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">🔧</div>
          <div className="stat-content">
            <div className="stat-value">{stats.totalMachines}</div>
            <div className="stat-label">Total Machines</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <div className="stat-value">{stats.activeMachines}</div>
            <div className="stat-label">Active Machines</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⏱️</div>
          <div className="stat-content">
            <div className="stat-value">{stats.totalHours}</div>
            <div className="stat-label">Total Operating Hours</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🔨</div>
          <div className="stat-content">
            <div className="stat-value">{stats.recentMaintenance}</div>
            <div className="stat-label">Maintenance Records</div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="home-actions">
        <Link to="/machines/create" className="btn btn-primary">
          Add New Machine
        </Link>
        <Link to="/machines" className="btn btn-secondary">
          View All Machines
        </Link>
      </div>

      {/* Recent Data Sections */}
      <div className="dashboard-sections">
        {/* Recent Machines */}
        <div className="dashboard-section">
          <div className="section-header">
            <h2>Recent Machines</h2>
            <Link to="/machines" className="section-link">View All →</Link>
          </div>
          {recentMachines.length === 0 ? (
            <div className="empty-section">
              <p>No machines yet. Create your first machine to get started.</p>
              <Link to="/machines/create" className="btn btn-primary btn-sm">
                Add Machine
              </Link>
            </div>
          ) : (
            <div className="section-content">
              {recentMachines.map((machine) => (
                <Link
                  key={machine.Id}
                  to={`/machines/${machine.Id}`}
                  className="dashboard-item"
                >
                  <div className="item-main">
                    <h3>{machine.Name}</h3>
                    <p className="item-meta">{machine.Model} • {machine.Type}</p>
                  </div>
                  <div className="item-side">
                    <span className={getStatusBadgeClass(machine.Status)}>
                      {machine.Status}
                    </span>
                    <span className="item-hours">{machine.OperatingHours || 0} hrs</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Recent Maintenance */}
        <div className="dashboard-section">
          <div className="section-header">
            <h2>Recent Maintenance</h2>
            <Link to="/maintenance" className="section-link">View All →</Link>
          </div>
          {recentMaintenance.length === 0 ? (
            <div className="empty-section">
              <p>No maintenance records yet.</p>
            </div>
          ) : (
            <div className="section-content">
              {recentMaintenance.map((record) => (
                <Link
                  key={record.Id}
                  to={`/machines/${record.MachineId}`}
                  className="dashboard-item"
                >
                  <div className="item-main">
                    <h3>{record.Type}</h3>
                    <p className="item-meta">
                      {record.MachineName || 'Unknown Machine'} • {new Date(record.PerformedDate).toLocaleDateString()}
                    </p>
                    <p className="item-description">{record.Description}</p>
                  </div>
                  <div className="item-side">
                    <span className="item-cost">${record.Cost?.toFixed(2)}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Recent Usage Logs */}
        <div className="dashboard-section">
          <div className="section-header">
            <h2>Recent Usage Logs</h2>
            <Link to="/usage-logs" className="section-link">View All →</Link>
          </div>
          {recentUsageLogs.length === 0 ? (
            <div className="empty-section">
              <p>No usage logs yet.</p>
            </div>
          ) : (
            <div className="section-content">
              {recentUsageLogs.map((log) => (
                <Link
                  key={log.Id}
                  to={`/machines/${log.MachineId}`}
                  className="dashboard-item"
                >
                  <div className="item-main">
                    <h3>{log.JobDescription}</h3>
                    <p className="item-meta">
                      {log.MachineName || 'Unknown Machine'} • {log.OperatorName}
                    </p>
                    <p className="item-description">
                      {new Date(log.StartTime).toLocaleString()}
                    </p>
                  </div>
                  <div className="item-side">
                    <span className="item-hours">{log.HoursUsed?.toFixed(1)} hrs</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;
