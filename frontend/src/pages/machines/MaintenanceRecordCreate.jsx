import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { maintenanceService, machineService } from '../../services/api';
import './RecordForm.css';

function MaintenanceRecordCreate() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [machine, setMachine] = useState(null);
  const [formData, setFormData] = useState({
    Type: '',
    Description: '',
    PerformedDate: new Date().toISOString().split('T')[0],
    NextDueDate: '',
    PerformedBy: '',
    Cost: 0,
    Notes: ''
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingMachine, setLoadingMachine] = useState(true);

  useEffect(() => {
    loadMachine();
  }, [id]);

  const loadMachine = async () => {
    try {
      setLoadingMachine(true);
      const response = await machineService.getById(id);
      setMachine(response.data);
    } catch (err) {
      setError('Failed to load machine');
      console.error(err);
    } finally {
      setLoadingMachine(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'Cost' ? (value === '' ? '' : parseFloat(value)) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await maintenanceService.create({
        ...formData,
        MachineId: parseInt(id),
        Cost: parseFloat(formData.Cost) || 0
      });
      navigate(`/machines/${id}`);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create maintenance record');
    } finally {
      setLoading(false);
    }
  };

  if (loadingMachine) {
    return <div className="loading">Loading machine...</div>;
  }

  return (
    <div className="record-form">
      <div className="form-header">
        <h1>Add Maintenance Record</h1>
        {machine && <p className="form-subtitle">Machine: {machine.Name}</p>}
        <button onClick={() => navigate(`/machines/${id}`)} className="btn btn-secondary">
          Cancel
        </button>
      </div>

      <form onSubmit={handleSubmit} className="form">
        {error && <div className="error-message">{error}</div>}

        <div className="form-group">
          <label htmlFor="Type">Type *</label>
          <select
            id="Type"
            name="Type"
            value={formData.Type}
            onChange={handleChange}
            required
          >
            <option value="">Select type</option>
            <option value="OilChange">Oil Change</option>
            <option value="FilterReplacement">Filter Replacement</option>
            <option value="TireReplacement">Tire Replacement</option>
            <option value="BladeSharpening">Blade Sharpening</option>
            <option value="BeltReplacement">Belt Replacement</option>
            <option value="GeneralInspection">General Inspection</option>
            <option value="Repair">Repair</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="Description">Description *</label>
          <textarea
            id="Description"
            name="Description"
            value={formData.Description}
            onChange={handleChange}
            rows="4"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="PerformedDate">Performed Date *</label>
          <input
            type="date"
            id="PerformedDate"
            name="PerformedDate"
            value={formData.PerformedDate}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="NextDueDate">Next Due Date</label>
          <input
            type="date"
            id="NextDueDate"
            name="NextDueDate"
            value={formData.NextDueDate}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="PerformedBy">Performed By *</label>
          <input
            type="text"
            id="PerformedBy"
            name="PerformedBy"
            value={formData.PerformedBy}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="Cost">Cost *</label>
          <input
            type="number"
            id="Cost"
            name="Cost"
            value={formData.Cost}
            onChange={handleChange}
            step="0.01"
            min="0"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="Notes">Notes</label>
          <textarea
            id="Notes"
            name="Notes"
            value={formData.Notes}
            onChange={handleChange}
            rows="3"
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Creating...' : 'Create Record'}
          </button>
          <button
            type="button"
            onClick={() => navigate(`/machines/${id}`)}
            className="btn btn-secondary"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default MaintenanceRecordCreate;

