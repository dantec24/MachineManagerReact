import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { machineService } from '../../services/api';
import { exportMachinesToPDF } from '../../services/pdfExport';
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

  const handleExportPDF = () => {
    console.log('Export PDF clicked, machines:', machines);
    exportMachinesToPDF(machines);
  };

  const handlePrintMachine = async (machineId) => {
    try {
      // Fetch full machine details including maintenance records and usage logs
      const response = await machineService.getById(machineId);
      const machine = response.data;
      
      // Create a print-friendly HTML content
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        alert('Please allow popups to print machine details');
        return;
      }

      const printContent = `
        <!DOCTYPE html>
        <html>
          <head>
            <title>Machine Details - ${machine.Name}</title>
            <style>
              @media print {
                @page {
                  margin: 1cm;
                }
                body {
                  margin: 0;
                  padding: 20px;
                  font-family: Arial, sans-serif;
                }
                .no-print {
                  display: none;
                }
              }
              body {
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 20px;
                color: #333;
              }
              .header {
                border-bottom: 3px solid #3498db;
                padding-bottom: 10px;
                margin-bottom: 20px;
              }
              h1 {
                color: #2c3e50;
                margin: 0 0 5px 0;
                font-size: 24px;
              }
              .print-date {
                color: #7f8c8d;
                font-size: 12px;
                margin: 0;
              }
              .section {
                margin: 25px 0;
                page-break-inside: avoid;
              }
              .section-title {
                font-size: 18px;
                color: #2c3e50;
                border-bottom: 2px solid #ecf0f1;
                padding-bottom: 5px;
                margin-bottom: 15px;
              }
              .info-table {
                width: 100%;
                border-collapse: collapse;
                margin: 15px 0;
              }
              .info-table td {
                padding: 8px 12px;
                border-bottom: 1px solid #ecf0f1;
              }
              .info-table td:first-child {
                font-weight: bold;
                width: 40%;
                color: #555;
              }
              .info-table td:last-child {
                color: #2c3e50;
              }
              .data-table {
                width: 100%;
                border-collapse: collapse;
                margin: 15px 0;
                font-size: 12px;
              }
              .data-table th {
                background-color: #3498db;
                color: white;
                padding: 10px;
                text-align: left;
                border: 1px solid #2980b9;
              }
              .data-table td {
                padding: 8px 10px;
                border: 1px solid #ddd;
              }
              .data-table tr:nth-child(even) {
                background-color: #f8f9fa;
              }
              .notes {
                background-color: #f8f9fa;
                padding: 15px;
                border-left: 4px solid #3498db;
                margin: 15px 0;
              }
              .footer {
                margin-top: 30px;
                padding-top: 15px;
                border-top: 2px solid #ecf0f1;
                text-align: center;
                color: #7f8c8d;
                font-size: 11px;
              }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>${machine.Name || 'Machine Details'}</h1>
              <p class="print-date">Generated: ${new Date().toLocaleString()}</p>
            </div>

            <div class="section">
              <div class="section-title">Basic Information</div>
              <table class="info-table">
                <tr>
                  <td>Model:</td>
                  <td>${machine.Model || 'N/A'}</td>
                </tr>
                <tr>
                  <td>Serial Number:</td>
                  <td>${machine.SerialNumber || 'N/A'}</td>
                </tr>
                <tr>
                  <td>Type:</td>
                  <td>${machine.Type || 'N/A'}</td>
                </tr>
                <tr>
                  <td>Status:</td>
                  <td>${machine.Status || 'N/A'}</td>
                </tr>
                <tr>
                  <td>Purchase Date:</td>
                  <td>${machine.PurchaseDate ? new Date(machine.PurchaseDate).toLocaleDateString() : 'N/A'}</td>
                </tr>
                <tr>
                  <td>Purchase Price:</td>
                  <td>${machine.PurchasePrice ? '$' + machine.PurchasePrice.toFixed(2) : 'N/A'}</td>
                </tr>
                <tr>
                  <td>Operating Hours:</td>
                  <td>${machine.OperatingHours || 0}</td>
                </tr>
                ${machine.LastMaintenanceDate ? `
                <tr>
                  <td>Last Maintenance:</td>
                  <td>${new Date(machine.LastMaintenanceDate).toLocaleDateString()}</td>
                </tr>
                ` : ''}
              </table>
            </div>

            ${machine.Notes ? `
            <div class="section">
              <div class="section-title">Notes</div>
              <div class="notes">${machine.Notes.replace(/\n/g, '<br>')}</div>
            </div>
            ` : ''}

            ${machine.MaintenanceRecords && machine.MaintenanceRecords.length > 0 ? `
            <div class="section">
              <div class="section-title">Maintenance Records (${machine.MaintenanceRecords.length})</div>
              <table class="data-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Type</th>
                    <th>Description</th>
                    <th>Performed By</th>
                    <th>Cost</th>
                    <th>Next Due</th>
                  </tr>
                </thead>
                <tbody>
                  ${machine.MaintenanceRecords.map(record => `
                    <tr>
                      <td>${record.PerformedDate ? new Date(record.PerformedDate).toLocaleDateString() : 'N/A'}</td>
                      <td>${record.Type || 'N/A'}</td>
                      <td>${record.Description || 'N/A'}</td>
                      <td>${record.PerformedBy || 'N/A'}</td>
                      <td>$${record.Cost ? record.Cost.toFixed(2) : '0.00'}</td>
                      <td>${record.NextDueDate ? new Date(record.NextDueDate).toLocaleDateString() : 'N/A'}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
            ` : ''}

            ${machine.UsageLogs && machine.UsageLogs.length > 0 ? `
            <div class="section">
              <div class="section-title">Usage Logs (${machine.UsageLogs.length})</div>
              <table class="data-table">
                <thead>
                  <tr>
                    <th>Start Date</th>
                    <th>Operator</th>
                    <th>Job Description</th>
                    <th>Hours</th>
                    <th>End Date</th>
                  </tr>
                </thead>
                <tbody>
                  ${machine.UsageLogs.map(log => `
                    <tr>
                      <td>${log.StartTime ? new Date(log.StartTime).toLocaleDateString() : 'N/A'}</td>
                      <td>${log.OperatorName || 'N/A'}</td>
                      <td>${log.JobDescription || 'N/A'}</td>
                      <td>${log.HoursUsed ? log.HoursUsed.toFixed(2) : '0.00'}</td>
                      <td>${log.EndTime ? new Date(log.EndTime).toLocaleDateString() : 'N/A'}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
            ` : ''}

            <div class="footer">
              Machine Manager - ${new Date().toLocaleDateString()}
            </div>

            <script>
              window.onload = function() {
                window.print();
                window.onafterprint = function() {
                  window.close();
                };
              };
            </script>
          </body>
        </html>
      `;

      printWindow.document.write(printContent);
      printWindow.document.close();
    } catch (err) {
      console.error('Error fetching machine details for print:', err);
      alert('Failed to load machine details for printing');
    }
  };

  return (
    <div className="machine-list">
      <div className="page-header">
        <h1>Machines</h1>
        <div className="page-header-actions">
          <button onClick={handleExportPDF} className="btn btn-export">
            📄 Export PDF
          </button>
          <Link to="/machines/create" className="btn btn-primary">
            Add New Machine
          </Link>
        </div>
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
                  onClick={() => handlePrintMachine(machine.Id)}
                  className="btn btn-print"
                  title="Print machine details"
                >
                  🖨️ Print
                </button>
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

