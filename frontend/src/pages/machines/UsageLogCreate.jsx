import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usageLogService, machineService } from '../../services/api';
import './RecordForm.css';

function UsageLogCreate() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [machine, setMachine] = useState(null);
  const [formData, setFormData] = useState({
    OperatorName: '',
    StartTime: new Date().toISOString().slice(0, 16),
    EndTime: '',
    HoursUsed: '',
    JobDescription: '',
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
      [name]: name === 'HoursUsed' ? (value === '' ? '' : parseFloat(value)) : value
    }));
  };

  const calculateHours = () => {
    if (formData.StartTime && formData.EndTime) {
      const start = new Date(formData.StartTime);
      const end = new Date(formData.EndTime);
      const diffMs = end - start;
      const diffHours = diffMs / (1000 * 60 * 60);
      if (diffHours > 0) {
        setFormData(prev => ({ ...prev, HoursUsed: diffHours.toFixed(2) }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await usageLogService.create({
        ...formData,
        MachineId: parseInt(id),
        HoursUsed: parseFloat(formData.HoursUsed) || 0,
        StartTime: new Date(formData.StartTime).toISOString(),
        EndTime: new Date(formData.EndTime).toISOString()
      });
      navigate(`/machines/${id}`);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create usage log');
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
        <h1>Add Usage Log</h1>
        {machine && <p className="form-subtitle">Machine: {machine.Name}</p>}
        <button onClick={() => navigate(`/machines/${id}`)} className="btn btn-secondary">
          Cancel
        </button>
      </div>

      <form onSubmit={handleSubmit} className="form">
        {error && <div className="error-message">{error}</div>}

        <div className="form-group">
          <label htmlFor="OperatorName">Operator Name *</label>
          <input
            type="text"
            id="OperatorName"
            name="OperatorName"
            value={formData.OperatorName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="StartTime">Start Time *</label>
          <input
            type="datetime-local"
            id="StartTime"
            name="StartTime"
            value={formData.StartTime}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="EndTime">End Time *</label>
          <input
            type="datetime-local"
            id="EndTime"
            name="EndTime"
            value={formData.EndTime}
            onChange={(e) => {
              handleChange(e);
              setTimeout(calculateHours, 100);
            }}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="HoursUsed">Hours Used *</label>
          <input
            type="number"
            id="HoursUsed"
            name="HoursUsed"
            value={formData.HoursUsed}
            onChange={handleChange}
            step="0.01"
            min="0"
            required
          />
          <small className="form-hint">Will be calculated automatically if start/end times are set</small>
        </div>

        <div className="form-group">
          <label htmlFor="JobDescription">Job Description *</label>
          <textarea
            id="JobDescription"
            name="JobDescription"
            value={formData.JobDescription}
            onChange={handleChange}
            rows="4"
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
            {loading ? 'Creating...' : 'Create Log'}
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

export default UsageLogCreate;

