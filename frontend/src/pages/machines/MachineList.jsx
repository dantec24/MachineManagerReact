import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { machineService } from '../../services/api';
import './MachineList.css';

function MachineList() {
  const [machines, setMachines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadMachines();
  }, []);

  const loadMachines = async () => {
    try {
      setLoading(true);
      const response = await machineService.getAll();
      setMachines(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load machines');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) {
      return;
    }

    try {
      await machineService.delete(id);
      loadMachines();
    } catch (err) {
      alert('Failed to delete machine');
      console.error(err);
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
    return <div className="loading">Loading machines...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="machine-list">
      <div className="page-header">
        <h1>Machines</h1>
        <Link to="/machines/create" className="btn btn-primary">
          Add New Machine
        </Link>
      </div>

      {machines.length === 0 ? (
        <div className="empty-state">
          <p>No machines found. Create your first machine to get started.</p>
          <Link to="/machines/create" className="btn btn-primary">
            Add Machine
          </Link>
        </div>
      ) : (
        <div className="machine-grid">
          {machines.map((machine) => (
            <div key={machine.Id} className="machine-card">
              <div className="machine-card-header">
                <h2>{machine.Name}</h2>
                <span className={getStatusBadgeClass(machine.Status)}>
                  {machine.Status}
                </span>
              </div>
              <div className="machine-card-body">
                <p><strong>Model:</strong> {machine.Model}</p>
                <p><strong>Serial Number:</strong> {machine.SerialNumber}</p>
                <p><strong>Type:</strong> {machine.Type}</p>
                <p><strong>Operating Hours:</strong> {machine.OperatingHours || 0}</p>
                <p><strong>Purchase Date:</strong> {new Date(machine.PurchaseDate).toLocaleDateString()}</p>
              </div>
              <div className="machine-card-actions">
                <Link to={`/machines/${machine.Id}`} className="btn btn-secondary">
                  View Details
                </Link>
                <Link to={`/machines/edit/${machine.Id}`} className="btn btn-secondary">
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(machine.Id, machine.Name)}
                  className="btn btn-danger"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MachineList;

