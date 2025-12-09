import express from 'express';
import { getDatabase } from '../database/db.js';

const router = express.Router();
const db = getDatabase();

// GET all machines
router.get('/', (req, res) => {
  try {
    const machines = db.prepare('SELECT * FROM Machines ORDER BY Name').all();
    res.json(machines);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET machine by ID
router.get('/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const machine = db.prepare('SELECT * FROM Machines WHERE Id = ?').get(id);
    
    if (!machine) {
      return res.status(404).json({ error: 'Machine not found' });
    }

    // Get related maintenance records
    const maintenanceRecords = db
      .prepare('SELECT * FROM MaintenanceRecords WHERE MachineId = ? ORDER BY PerformedDate DESC')
      .all(id);

    // Get related usage logs
    const usageLogs = db
      .prepare('SELECT * FROM UsageLogs WHERE MachineId = ? ORDER BY StartTime DESC')
      .all(id);

    res.json({
      ...machine,
      MaintenanceRecords: maintenanceRecords,
      UsageLogs: usageLogs
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET machine by serial number
router.get('/serial/:serialNumber', (req, res) => {
  try {
    const machine = db
      .prepare('SELECT * FROM Machines WHERE SerialNumber = ?')
      .get(req.params.serialNumber);
    
    if (!machine) {
      return res.status(404).json({ error: 'Machine not found' });
    }
    
    res.json(machine);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST create new machine
router.post('/', (req, res) => {
  try {
    const {
      Name,
      Model,
      SerialNumber,
      Type,
      Status,
      PurchaseDate,
      PurchasePrice,
      LastMaintenanceDate,
      OperatingHours,
      Notes
    } = req.body;

    if (!Name || !Model || !SerialNumber || !Type || !Status || !PurchaseDate || PurchasePrice === undefined) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const result = db
      .prepare(`
        INSERT INTO Machines (
          Name, Model, SerialNumber, Type, Status, PurchaseDate, PurchasePrice,
          LastMaintenanceDate, OperatingHours, Notes, CreatedAt
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
      `)
      .run(
        Name,
        Model,
        SerialNumber,
        Type,
        Status,
        PurchaseDate,
        PurchasePrice,
        LastMaintenanceDate || null,
        OperatingHours || 0,
        Notes || null
      );

    const newMachine = db.prepare('SELECT * FROM Machines WHERE Id = ?').get(result.lastInsertRowid);
    res.status(201).json(newMachine);
  } catch (error) {
    if (error.message.includes('UNIQUE constraint')) {
      return res.status(400).json({ error: 'Serial number already exists' });
    }
    res.status(500).json({ error: error.message });
  }
});

// PUT update machine
router.put('/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const {
      Name,
      Model,
      SerialNumber,
      Type,
      Status,
      PurchaseDate,
      PurchasePrice,
      LastMaintenanceDate,
      OperatingHours,
      Notes
    } = req.body;

    const existing = db.prepare('SELECT * FROM Machines WHERE Id = ?').get(id);
    if (!existing) {
      return res.status(404).json({ error: 'Machine not found' });
    }

    db.prepare(`
      UPDATE Machines SET
        Name = ?,
        Model = ?,
        SerialNumber = ?,
        Type = ?,
        Status = ?,
        PurchaseDate = ?,
        PurchasePrice = ?,
        LastMaintenanceDate = ?,
        OperatingHours = ?,
        Notes = ?,
        UpdatedAt = datetime('now')
      WHERE Id = ?
    `).run(
      Name,
      Model,
      SerialNumber,
      Type,
      Status,
      PurchaseDate,
      PurchasePrice,
      LastMaintenanceDate || null,
      OperatingHours || 0,
      Notes || null,
      id
    );

    const updated = db.prepare('SELECT * FROM Machines WHERE Id = ?').get(id);
    res.json(updated);
  } catch (error) {
    if (error.message.includes('UNIQUE constraint')) {
      return res.status(400).json({ error: 'Serial number already exists' });
    }
    res.status(500).json({ error: error.message });
  }
});

// DELETE machine
router.delete('/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const existing = db.prepare('SELECT * FROM Machines WHERE Id = ?').get(id);
    
    if (!existing) {
      return res.status(404).json({ error: 'Machine not found' });
    }

    db.prepare('DELETE FROM Machines WHERE Id = ?').run(id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
