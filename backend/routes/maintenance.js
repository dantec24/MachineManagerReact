import express from 'express';
import { getDatabase } from '../database/db.js';

const router = express.Router();
const db = getDatabase();

// GET all maintenance records
router.get('/', (req, res) => {
  try {
    const records = db
      .prepare(`
        SELECT mr.*, m.Name as MachineName, m.Model as MachineModel
        FROM MaintenanceRecords mr
        JOIN Machines m ON mr.MachineId = m.Id
        ORDER BY mr.PerformedDate DESC
      `)
      .all();
    res.json(records);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET maintenance records by machine ID
router.get('/machine/:machineId', (req, res) => {
  try {
    const machineId = parseInt(req.params.machineId);
    const records = db
      .prepare('SELECT * FROM MaintenanceRecords WHERE MachineId = ? ORDER BY PerformedDate DESC')
      .all(machineId);
    res.json(records);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET maintenance record by ID
router.get('/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const record = db.prepare('SELECT * FROM MaintenanceRecords WHERE Id = ?').get(id);
    
    if (!record) {
      return res.status(404).json({ error: 'Maintenance record not found' });
    }
    
    res.json(record);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST create new maintenance record
router.post('/', (req, res) => {
  try {
    const {
      MachineId,
      Type,
      Description,
      PerformedDate,
      NextDueDate,
      PerformedBy,
      Cost,
      Notes
    } = req.body;

    if (!MachineId || !Type || !Description || !PerformedDate || !PerformedBy || Cost === undefined) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Verify machine exists
    const machine = db.prepare('SELECT * FROM Machines WHERE Id = ?').get(MachineId);
    if (!machine) {
      return res.status(404).json({ error: 'Machine not found' });
    }

    const result = db
      .prepare(`
        INSERT INTO MaintenanceRecords (
          MachineId, Type, Description, PerformedDate, NextDueDate,
          PerformedBy, Cost, Notes, CreatedAt
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
      `)
      .run(
        MachineId,
        Type,
        Description,
        PerformedDate,
        NextDueDate || null,
        PerformedBy,
        Cost || 0,
        Notes || null
      );

    // Update machine's last maintenance date
    db.prepare(`
      UPDATE Machines 
      SET LastMaintenanceDate = ?, UpdatedAt = datetime('now')
      WHERE Id = ?
    `).run(PerformedDate, MachineId);

    const newRecord = db.prepare('SELECT * FROM MaintenanceRecords WHERE Id = ?').get(result.lastInsertRowid);
    res.status(201).json(newRecord);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT update maintenance record
router.put('/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const {
      MachineId,
      Type,
      Description,
      PerformedDate,
      NextDueDate,
      PerformedBy,
      Cost,
      Notes
    } = req.body;

    const existing = db.prepare('SELECT * FROM MaintenanceRecords WHERE Id = ?').get(id);
    if (!existing) {
      return res.status(404).json({ error: 'Maintenance record not found' });
    }

    db.prepare(`
      UPDATE MaintenanceRecords SET
        MachineId = ?,
        Type = ?,
        Description = ?,
        PerformedDate = ?,
        NextDueDate = ?,
        PerformedBy = ?,
        Cost = ?,
        Notes = ?
      WHERE Id = ?
    `).run(
      MachineId,
      Type,
      Description,
      PerformedDate,
      NextDueDate || null,
      PerformedBy,
      Cost || 0,
      Notes || null,
      id
    );

    const updated = db.prepare('SELECT * FROM MaintenanceRecords WHERE Id = ?').get(id);
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE maintenance record
router.delete('/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const existing = db.prepare('SELECT * FROM MaintenanceRecords WHERE Id = ?').get(id);
    
    if (!existing) {
      return res.status(404).json({ error: 'Maintenance record not found' });
    }

    db.prepare('DELETE FROM MaintenanceRecords WHERE Id = ?').run(id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

