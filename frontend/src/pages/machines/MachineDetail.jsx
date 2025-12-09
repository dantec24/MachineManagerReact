import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { machineService } from '../../services/api';
import './MachineDetail.css';

function MachineDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [machine, setMachine] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadMachine();
  }, [id]);

  const loadMachine = async () => {
    try {
      setLoading(true);
      const response = await machineService.getById(id);
      setMachine(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load machine details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete "${machine.Name}"?`)) {
      return;
    }

    try {
      await machineService.delete(id);
      navigate('/machines');
    } catch (err) {
      alert('Failed to delete machine');
      console.error(err);
    }
  };

  if (loading) {
    return <div className="loading">Loading machine details...</div>;
  }

  if (error || !machine) {
    return <div className="error">{error || 'Machine not found'}</div>;
  }

  return (
    <div className="machine-detail">
      <div className="detail-header">
        <Link to="/machines" className="back-link">← Back to Machines</Link>
        <div className="detail-actions">
          <Link to={`/machines/edit/${id}`} className="btn btn-secondary">
            Edit
          </Link>
          <button onClick={handleDelete} className="btn btn-danger">
            Delete
          </button>
        </div>
      </div>

      <div className="detail-content">
        <div className="detail-section">
          <h1>{machine.Name}</h1>
          <div className="detail-info">
            <div className="info-row">
              <span className="info-label">Model:</span>
              <span className="info-value">{machine.Model}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Serial Number:</span>
              <span className="info-value">{machine.SerialNumber}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Type:</span>
              <span className="info-value">{machine.Type}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Status:</span>
              <span className={`status-badge status-${machine.Status?.toLowerCase()}`}>
                {machine.Status}
              </span>
            </div>
            <div className="info-row">
              <span className="info-label">Purchase Date:</span>
              <span className="info-value">
                {new Date(machine.PurchaseDate).toLocaleDateString()}
              </span>
            </div>
            <div className="info-row">
              <span className="info-label">Purchase Price:</span>
              <span className="info-value">${machine.PurchasePrice?.toFixed(2)}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Operating Hours:</span>
              <span className="info-value">{machine.OperatingHours || 0}</span>
            </div>
            {machine.LastMaintenanceDate && (
              <div className="info-row">
                <span className="info-label">Last Maintenance:</span>
                <span className="info-value">
                  {new Date(machine.LastMaintenanceDate).toLocaleDateString()}
                </span>
              </div>
            )}
            {machine.Notes && (
              <div className="info-row">
                <span className="info-label">Notes:</span>
                <span className="info-value">{machine.Notes}</span>
              </div>
            )}
          </div>
        </div>

        <div className="detail-actions-section">
          <Link
            to={`/machines/${id}/maintenance/create`}
            className="btn btn-primary"
          >
            Add Maintenance Record
          </Link>
          <Link
            to={`/machines/${id}/usage/create`}
            className="btn btn-primary"
          >
            Add Usage Log
          </Link>
        </div>

        {machine.MaintenanceRecords && machine.MaintenanceRecords.length > 0 && (
          <div className="detail-section">
            <h2>Maintenance Records</h2>
            <div className="records-list">
              {machine.MaintenanceRecords.map((record) => (
                <div key={record.Id} className="record-item">
                  <div className="record-header">
                    <strong>{record.Type}</strong>
                    <span>{new Date(record.PerformedDate).toLocaleDateString()}</span>
                  </div>
                  <p>{record.Description}</p>
                  <p className="record-meta">
                    Performed by: {record.PerformedBy} | Cost: ${record.Cost?.toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {machine.UsageLogs && machine.UsageLogs.length > 0 && (
          <div className="detail-section">
            <h2>Usage Logs</h2>
            <div className="records-list">
              {machine.UsageLogs.map((log) => (
                <div key={log.Id} className="record-item">
                  <div className="record-header">
                    <strong>{log.JobDescription}</strong>
                    <span>{new Date(log.StartTime).toLocaleDateString()}</span>
                  </div>
                  <p>Operator: {log.OperatorName} | Hours: {log.HoursUsed}</p>
                  {log.Notes && <p className="record-meta">{log.Notes}</p>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MachineDetail;

