import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { maintenanceService } from '../services/api';
import './Maintenance.css';

function Maintenance() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadRecords();
  }, []);

  const loadRecords = async () => {
    try {
      setLoading(true);
      const response = await maintenanceService.getAll();
      setRecords(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load maintenance records');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading maintenance records...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="maintenance-page">
      <div className="page-header">
        <h1>Maintenance Records</h1>
      </div>

      {records.length === 0 ? (
        <div className="empty-state">
          <p>No maintenance records found.</p>
        </div>
      ) : (
        <div className="records-table">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Machine</th>
                <th>Type</th>
                <th>Description</th>
                <th>Performed By</th>
                <th>Cost</th>
              </tr>
            </thead>
            <tbody>
              {records.map((record) => (
                <tr key={record.Id}>
                  <td>{new Date(record.PerformedDate).toLocaleDateString()}</td>
                  <td>
                    <Link to={`/machines/${record.MachineId}`} className="machine-link">
                      {record.MachineName || 'Unknown'}
                    </Link>
                  </td>
                  <td>{record.Type}</td>
                  <td>{record.Description}</td>
                  <td>{record.PerformedBy}</td>
                  <td>${record.Cost?.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Maintenance;

