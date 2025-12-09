import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { usageLogService } from '../services/api';
import { exportUsageLogsToPDF } from '../services/pdfExport';
import './UsageLogs.css';

function UsageLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    try {
      setLoading(true);
      const response = await usageLogService.getAll();
      setLogs(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load usage logs');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading usage logs...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  const handleExportPDF = () => {
    exportUsageLogsToPDF(logs);
  };

  return (
    <div className="usage-logs-page">
      <div className="page-header">
        <h1>Usage Logs</h1>
        <button onClick={handleExportPDF} className="btn btn-export">
          📄 Export PDF
        </button>
      </div>

      {logs.length === 0 ? (
        <div className="empty-state">
          <p>No usage logs found.</p>
        </div>
      ) : (
        <div className="logs-table">
          <table>
            <thead>
              <tr>
                <th>Start Time</th>
                <th>Machine</th>
                <th>Operator</th>
                <th>Job Description</th>
                <th>Hours Used</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.Id}>
                  <td>{new Date(log.StartTime).toLocaleString()}</td>
                  <td>
                    <Link to={`/machines/${log.MachineId}`} className="machine-link">
                      {log.MachineName || 'Unknown'}
                    </Link>
                  </td>
                  <td>{log.OperatorName}</td>
                  <td>{log.JobDescription}</td>
                  <td>{log.HoursUsed?.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default UsageLogs;

