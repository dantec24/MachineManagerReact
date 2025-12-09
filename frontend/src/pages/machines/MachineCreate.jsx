import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { machineService } from '../../services/api';
import './MachineForm.css';

function MachineCreate() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    Name: '',
    Model: '',
    SerialNumber: '',
    Type: '',
    Status: 'Active',
    PurchaseDate: '',
    PurchasePrice: '',
    OperatingHours: 0,
    Notes: ''
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'PurchasePrice' || name === 'OperatingHours' 
        ? (value === '' ? '' : parseFloat(value)) 
        : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await machineService.create({
        ...formData,
        PurchasePrice: parseFloat(formData.PurchasePrice) || 0,
        OperatingHours: parseInt(formData.OperatingHours) || 0
      });
      navigate('/machines');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create machine');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="machine-form">
      <div className="form-header">
        <h1>Create New Machine</h1>
        <button onClick={() => navigate('/machines')} className="btn btn-secondary">
          Cancel
        </button>
      </div>

      <form onSubmit={handleSubmit} className="form">
        {error && <div className="error-message">{error}</div>}

        <div className="form-group">
          <label htmlFor="Name">Name *</label>
          <input
            type="text"
            id="Name"
            name="Name"
            value={formData.Name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="Model">Model *</label>
          <input
            type="text"
            id="Model"
            name="Model"
            value={formData.Model}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="SerialNumber">Serial Number *</label>
          <input
            type="text"
            id="SerialNumber"
            name="SerialNumber"
            value={formData.SerialNumber}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="Type">Type *</label>
          <input
            type="text"
            id="Type"
            name="Type"
            value={formData.Type}
            onChange={handleChange}
            required
            placeholder="e.g., Mower, Trimmer, Tractor"
          />
        </div>

        <div className="form-group">
          <label htmlFor="Status">Status *</label>
          <select
            id="Status"
            name="Status"
            value={formData.Status}
            onChange={handleChange}
            required
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="Maintenance">Maintenance</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="PurchaseDate">Purchase Date *</label>
          <input
            type="date"
            id="PurchaseDate"
            name="PurchaseDate"
            value={formData.PurchaseDate}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="PurchasePrice">Purchase Price *</label>
          <input
            type="number"
            id="PurchasePrice"
            name="PurchasePrice"
            value={formData.PurchasePrice}
            onChange={handleChange}
            step="0.01"
            min="0"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="OperatingHours">Operating Hours</label>
          <input
            type="number"
            id="OperatingHours"
            name="OperatingHours"
            value={formData.OperatingHours}
            onChange={handleChange}
            min="0"
          />
        </div>

        <div className="form-group">
          <label htmlFor="Notes">Notes</label>
          <textarea
            id="Notes"
            name="Notes"
            value={formData.Notes}
            onChange={handleChange}
            rows="4"
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Creating...' : 'Create Machine'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/machines')}
            className="btn btn-secondary"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default MachineCreate;

