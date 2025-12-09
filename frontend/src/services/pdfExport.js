import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

/**
 * Export machines data to PDF
 */
export const exportMachinesToPDF = (machines) => {
  try {
    if (!machines || machines.length === 0) {
      alert('No machines data to export');
      return;
    }

    const doc = new jsPDF();
  
    // Title
    doc.setFontSize(18);
    doc.text('Machines Report', 14, 22);
  
    // Date
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 30);
  
    // Table data
    const tableData = machines.map(machine => [
      machine.Name || 'N/A',
      machine.Model || 'N/A',
      machine.SerialNumber || 'N/A',
      machine.Type || 'N/A',
      machine.Status || 'N/A',
      machine.OperatingHours || 0,
      machine.PurchaseDate ? new Date(machine.PurchaseDate).toLocaleDateString() : 'N/A',
      machine.PurchasePrice ? `$${machine.PurchasePrice.toFixed(2)}` : 'N/A'
    ]);

    autoTable(doc, {
      startY: 35,
      head: [['Name', 'Model', 'Serial Number', 'Type', 'Status', 'Hours', 'Purchase Date', 'Price']],
      body: tableData,
      theme: 'striped',
      headStyles: { fillColor: [52, 152, 219] },
      styles: { fontSize: 8 },
      columnStyles: {
        0: { cellWidth: 30 },
        1: { cellWidth: 25 },
        2: { cellWidth: 30 },
        3: { cellWidth: 25 },
        4: { cellWidth: 20 },
        5: { cellWidth: 15 },
        6: { cellWidth: 25 },
        7: { cellWidth: 20 }
      }
    });

    // Footer
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      doc.text(
        `Page ${i} of ${pageCount}`,
        doc.internal.pageSize.getWidth() / 2,
        doc.internal.pageSize.getHeight() - 10,
        { align: 'center' }
      );
    }

    doc.save(`machines-report-${new Date().toISOString().split('T')[0]}.pdf`);
  } catch (error) {
    console.error('Error exporting machines to PDF:', error);
    alert(`Failed to export PDF: ${error.message}. Please check the console for details.`);
  }
};

/**
 * Export maintenance records to PDF
 */
export const exportMaintenanceToPDF = (records) => {
  try {
    if (!records || records.length === 0) {
      alert('No maintenance records to export');
      return;
    }

    const doc = new jsPDF();
  
    // Title
    doc.setFontSize(18);
    doc.text('Maintenance Records Report', 14, 22);
  
    // Date
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 30);
  
    // Summary
    const totalCost = records.reduce((sum, record) => sum + (record.Cost || 0), 0);
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text(`Total Records: ${records.length} | Total Cost: $${totalCost.toFixed(2)}`, 14, 37);
  
    // Table data
    const tableData = records.map(record => [
      record.PerformedDate ? new Date(record.PerformedDate).toLocaleDateString() : 'N/A',
      record.MachineName || 'Unknown',
      record.Type || 'N/A',
      record.Description || 'N/A',
      record.PerformedBy || 'N/A',
      record.Cost ? `$${record.Cost.toFixed(2)}` : '$0.00',
      record.NextDueDate ? new Date(record.NextDueDate).toLocaleDateString() : 'N/A'
    ]);

    autoTable(doc, {
      startY: 43,
      head: [['Date', 'Machine', 'Type', 'Description', 'Performed By', 'Cost', 'Next Due']],
      body: tableData,
      theme: 'striped',
      headStyles: { fillColor: [52, 152, 219] },
      styles: { fontSize: 8 },
      columnStyles: {
        0: { cellWidth: 25 },
        1: { cellWidth: 30 },
        2: { cellWidth: 25 },
        3: { cellWidth: 40 },
        4: { cellWidth: 25 },
        5: { cellWidth: 20 },
        6: { cellWidth: 25 }
      }
    });

    // Footer
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      doc.text(
        `Page ${i} of ${pageCount}`,
        doc.internal.pageSize.getWidth() / 2,
        doc.internal.pageSize.getHeight() - 10,
        { align: 'center' }
      );
    }

    doc.save(`maintenance-records-${new Date().toISOString().split('T')[0]}.pdf`);
  } catch (error) {
    console.error('Error exporting maintenance to PDF:', error);
    alert(`Failed to export PDF: ${error.message}. Please check the console for details.`);
  }
};

/**
 * Export usage logs to PDF
 */
export const exportUsageLogsToPDF = (logs) => {
  try {
    if (!logs || logs.length === 0) {
      alert('No usage logs to export');
      return;
    }

    const doc = new jsPDF();
  
    // Title
    doc.setFontSize(18);
    doc.text('Usage Logs Report', 14, 22);
  
    // Date
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 30);
  
    // Summary
    const totalHours = logs.reduce((sum, log) => sum + (log.HoursUsed || 0), 0);
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text(`Total Logs: ${logs.length} | Total Hours: ${totalHours.toFixed(2)}`, 14, 37);
  
    // Table data
    const tableData = logs.map(log => [
      log.StartTime ? new Date(log.StartTime).toLocaleString() : 'N/A',
      log.MachineName || 'Unknown',
      log.OperatorName || 'N/A',
      log.JobDescription || 'N/A',
      log.HoursUsed ? log.HoursUsed.toFixed(2) : '0.00',
      log.EndTime ? new Date(log.EndTime).toLocaleString() : 'N/A'
    ]);

    autoTable(doc, {
      startY: 43,
      head: [['Start Time', 'Machine', 'Operator', 'Job Description', 'Hours', 'End Time']],
      body: tableData,
      theme: 'striped',
      headStyles: { fillColor: [52, 152, 219] },
      styles: { fontSize: 8 },
      columnStyles: {
        0: { cellWidth: 35 },
        1: { cellWidth: 30 },
        2: { cellWidth: 25 },
        3: { cellWidth: 40 },
        4: { cellWidth: 15 },
        5: { cellWidth: 35 }
      }
    });

    // Footer
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      doc.text(
        `Page ${i} of ${pageCount}`,
        doc.internal.pageSize.getWidth() / 2,
        doc.internal.pageSize.getHeight() - 10,
        { align: 'center' }
      );
    }

    doc.save(`usage-logs-${new Date().toISOString().split('T')[0]}.pdf`);
  } catch (error) {
    console.error('Error exporting usage logs to PDF:', error);
    alert(`Failed to export PDF: ${error.message}. Please check the console for details.`);
  }
};

/**
 * Export dashboard summary to PDF
 */
export const exportDashboardToPDF = (maintenance, usageLogs) => {
  try {
    const doc = new jsPDF();
  
    // Title
    doc.setFontSize(18);
    doc.text('Activity Dashboard Report', 14, 22);
  
    // Date
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 30);
  
    // Recent Maintenance Section
    let yPos = 40;
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text('Recent Maintenance Records', 14, yPos);
  
    yPos += 8;
    const maintenanceData = (maintenance || []).slice(0, 10).map(record => [
      record.PerformedDate ? new Date(record.PerformedDate).toLocaleDateString() : 'N/A',
      record.MachineName || 'Unknown',
      record.Type || 'N/A',
      record.Description || 'N/A',
      record.Cost ? `$${record.Cost.toFixed(2)}` : '$0.00'
    ]);

    if (maintenanceData.length > 0) {
      autoTable(doc, {
        startY: yPos,
        head: [['Date', 'Machine', 'Type', 'Description', 'Cost']],
        body: maintenanceData,
        theme: 'striped',
        headStyles: { fillColor: [52, 152, 219] },
        styles: { fontSize: 8 },
        margin: { left: 14, right: 14 }
      });

      yPos = doc.lastAutoTable?.finalY ? doc.lastAutoTable.finalY + 15 : yPos + 50;
    } else {
      doc.setFontSize(10);
      doc.text('No maintenance records', 14, yPos);
      yPos += 15;
    }

    // Recent Usage Logs Section
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text('Recent Usage Logs', 14, yPos);
  
    yPos += 8;
    const usageData = (usageLogs || []).slice(0, 10).map(log => [
      log.StartTime ? new Date(log.StartTime).toLocaleString() : 'N/A',
      log.MachineName || 'Unknown',
      log.OperatorName || 'N/A',
      log.JobDescription || 'N/A',
      log.HoursUsed ? log.HoursUsed.toFixed(2) : '0.00'
    ]);

    if (usageData.length > 0) {
      autoTable(doc, {
        startY: yPos,
        head: [['Start Time', 'Machine', 'Operator', 'Job Description', 'Hours']],
        body: usageData,
        theme: 'striped',
        headStyles: { fillColor: [52, 152, 219] },
        styles: { fontSize: 8 },
        margin: { left: 14, right: 14 }
      });
    } else {
      doc.setFontSize(10);
      doc.text('No usage logs', 14, yPos);
    }

    // Footer
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      doc.text(
        `Page ${i} of ${pageCount}`,
        doc.internal.pageSize.getWidth() / 2,
        doc.internal.pageSize.getHeight() - 10,
        { align: 'center' }
      );
    }

    doc.save(`dashboard-report-${new Date().toISOString().split('T')[0]}.pdf`);
  } catch (error) {
    console.error('Error exporting dashboard to PDF:', error);
    alert(`Failed to export PDF: ${error.message}. Please check the console for details.`);
  }
};

/**
 * Export single machine details to PDF
 */
export const exportMachineDetailToPDF = (machine) => {
  try {
    if (!machine) {
      alert('No machine data to print');
      return;
    }

    const doc = new jsPDF();
  
    // Title
    doc.setFontSize(20);
    doc.text('Machine Details Report', 14, 22);
  
    // Machine Name
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text(machine.Name || 'Unknown Machine', 14, 35);
  
    // Date
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 43);
  
    let yPos = 52;
    
    // Basic Information Section
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text('Basic Information', 14, yPos);
    yPos += 8;

    const basicInfo = [
      ['Model:', machine.Model || 'N/A'],
      ['Serial Number:', machine.SerialNumber || 'N/A'],
      ['Type:', machine.Type || 'N/A'],
      ['Status:', machine.Status || 'N/A'],
      ['Purchase Date:', machine.PurchaseDate ? new Date(machine.PurchaseDate).toLocaleDateString() : 'N/A'],
      ['Purchase Price:', machine.PurchasePrice ? `$${machine.PurchasePrice.toFixed(2)}` : 'N/A'],
      ['Operating Hours:', machine.OperatingHours || 0],
      ['Last Maintenance:', machine.LastMaintenanceDate ? new Date(machine.LastMaintenanceDate).toLocaleDateString() : 'N/A']
    ];

    autoTable(doc, {
      startY: yPos,
      head: [['Property', 'Value']],
      body: basicInfo,
      theme: 'plain',
      headStyles: { fillColor: [52, 152, 219] },
      styles: { fontSize: 10 },
      columnStyles: {
        0: { cellWidth: 60, fontStyle: 'bold' },
        1: { cellWidth: 120 }
      },
      margin: { left: 14, right: 14 }
    });

    yPos = doc.lastAutoTable?.finalY ? doc.lastAutoTable.finalY + 15 : yPos + 50;

    // Notes Section
    if (machine.Notes) {
      doc.setFontSize(12);
      doc.text('Notes', 14, yPos);
      yPos += 8;
      doc.setFontSize(10);
      const notesLines = doc.splitTextToSize(machine.Notes, 180);
      doc.text(notesLines, 14, yPos);
      yPos += notesLines.length * 5 + 10;
    }

    // Maintenance Records Section
    if (machine.MaintenanceRecords && machine.MaintenanceRecords.length > 0) {
      doc.setFontSize(12);
      doc.text('Maintenance Records', 14, yPos);
      yPos += 8;

      const maintenanceData = machine.MaintenanceRecords.map(record => [
        record.PerformedDate ? new Date(record.PerformedDate).toLocaleDateString() : 'N/A',
        record.Type || 'N/A',
        record.Description || 'N/A',
        record.PerformedBy || 'N/A',
        record.Cost ? `$${record.Cost.toFixed(2)}` : '$0.00',
        record.NextDueDate ? new Date(record.NextDueDate).toLocaleDateString() : 'N/A'
      ]);

      autoTable(doc, {
        startY: yPos,
        head: [['Date', 'Type', 'Description', 'Performed By', 'Cost', 'Next Due']],
        body: maintenanceData,
        theme: 'striped',
        headStyles: { fillColor: [52, 152, 219] },
        styles: { fontSize: 8 },
        columnStyles: {
          0: { cellWidth: 25 },
          1: { cellWidth: 25 },
          2: { cellWidth: 50 },
          3: { cellWidth: 30 },
          4: { cellWidth: 20 },
          5: { cellWidth: 25 }
        },
        margin: { left: 14, right: 14 }
      });

      yPos = doc.lastAutoTable?.finalY ? doc.lastAutoTable.finalY + 15 : yPos + 50;
    }

    // Usage Logs Section
    if (machine.UsageLogs && machine.UsageLogs.length > 0) {
      doc.setFontSize(12);
      doc.text('Usage Logs', 14, yPos);
      yPos += 8;

      const usageData = machine.UsageLogs.map(log => [
        log.StartTime ? new Date(log.StartTime).toLocaleDateString() : 'N/A',
        log.OperatorName || 'N/A',
        log.JobDescription || 'N/A',
        log.HoursUsed ? log.HoursUsed.toFixed(2) : '0.00',
        log.EndTime ? new Date(log.EndTime).toLocaleDateString() : 'N/A'
      ]);

      autoTable(doc, {
        startY: yPos,
        head: [['Start Date', 'Operator', 'Job Description', 'Hours', 'End Date']],
        body: usageData,
        theme: 'striped',
        headStyles: { fillColor: [52, 152, 219] },
        styles: { fontSize: 8 },
        columnStyles: {
          0: { cellWidth: 30 },
          1: { cellWidth: 30 },
          2: { cellWidth: 60 },
          3: { cellWidth: 20 },
          4: { cellWidth: 30 }
        },
        margin: { left: 14, right: 14 }
      });
    }

    // Footer
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      doc.text(
        `Page ${i} of ${pageCount}`,
        doc.internal.pageSize.getWidth() / 2,
        doc.internal.pageSize.getHeight() - 10,
        { align: 'center' }
      );
    }

    doc.save(`${machine.Name || 'machine'}-details-${new Date().toISOString().split('T')[0]}.pdf`);
  } catch (error) {
    console.error('Error exporting machine details to PDF:', error);
    alert(`Failed to print machine details: ${error.message}. Please check the console for details.`);
  }
};
