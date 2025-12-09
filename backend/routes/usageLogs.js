import express from 'express';
import { getDatabase } from '../database/db.js';

const router = express.Router();
const db = getDatabase();

// GET all usage logs
router.get('/', (req, res) => {
  try {
    const logs = db
      .prepare(`
        SELECT ul.*, m.Name as MachineName, m.Model as MachineModel
        FROM UsageLogs ul
        JOIN Machines m ON ul.MachineId = m.Id
        ORDER BY ul.StartTime DESC
      `)
      .all();
    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET usage logs by machine ID
router.get('/machine/:machineId', (req, res) => {
  try {
    const machineId = parseInt(req.params.machineId);
    const logs = db
      .prepare('SELECT * FROM UsageLogs WHERE MachineId = ? ORDER BY StartTime DESC')
      .all(machineId);
    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET usage log by ID
router.get('/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const log = db.prepare('SELECT * FROM UsageLogs WHERE Id = ?').get(id);
    
    if (!log) {
      return res.status(404).json({ error: 'Usage log not found' });
    }
    
    res.json(log);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST create new usage log
router.post('/', (req, res) => {
  try {
    const {
      MachineId,
      OperatorName,
      StartTime,
      EndTime,
      HoursUsed,
      JobDescription,
      Notes
    } = req.body;

    if (!MachineId || !OperatorName || !StartTime || !EndTime || HoursUsed === undefined || !JobDescription) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Verify machine exists
    const machine = db.prepare('SELECT * FROM Machines WHERE Id = ?').get(MachineId);
    if (!machine) {
      return res.status(404).json({ error: 'Machine not found' });
    }

    const result = db
      .prepare(`
        INSERT INTO UsageLogs (
          MachineId, OperatorName, StartTime, EndTime, HoursUsed, JobDescription, Notes, CreatedAt
        ) VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'))
      `)
      .run(
        MachineId,
        OperatorName,
        StartTime,
        EndTime,
        HoursUsed,
        JobDescription,
        Notes || null
      );

    // Update machine's operating hours
    db.prepare(`
      UPDATE Machines 
      SET OperatingHours = OperatingHours + ?, UpdatedAt = datetime('now')
      WHERE Id = ?
    `).run(Math.round(HoursUsed), MachineId);

    const newLog = db.prepare('SELECT * FROM UsageLogs WHERE Id = ?').get(result.lastInsertRowid);
    res.status(201).json(newLog);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT update usage log
router.put('/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const {
      MachineId,
      OperatorName,
      StartTime,
      EndTime,
      HoursUsed,
      JobDescription,
      Notes
    } = req.body;

    const existing = db.prepare('SELECT * FROM UsageLogs WHERE Id = ?').get(id);
    if (!existing) {
      return res.status(404).json({ error: 'Usage log not found' });
    }

    // Calculate hours difference if hours changed
    const hoursDiff = HoursUsed - existing.HoursUsed;

    db.prepare(`
      UPDATE UsageLogs SET
        MachineId = ?,
        OperatorName = ?,
        StartTime = ?,
        EndTime = ?,
        HoursUsed = ?,
        JobDescription = ?,
        Notes = ?
      WHERE Id = ?
    `).run(
      MachineId,
      OperatorName,
      StartTime,
      EndTime,
      HoursUsed,
      JobDescription,
      Notes || null,
      id
    );

    // Update machine's operating hours if changed
    if (hoursDiff !== 0) {
      db.prepare(`
        UPDATE Machines 
        SET OperatingHours = OperatingHours + ?, UpdatedAt = datetime('now')
        WHERE Id = ?
      `).run(Math.round(hoursDiff), MachineId);
    }

    const updated = db.prepare('SELECT * FROM UsageLogs WHERE Id = ?').get(id);
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE usage log
router.delete('/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const existing = db.prepare('SELECT * FROM UsageLogs WHERE Id = ?').get(id);
    
    if (!existing) {
      return res.status(404).json({ error: 'Usage log not found' });
    }

    // Subtract hours from machine before deleting
    db.prepare(`
      UPDATE Machines 
      SET OperatingHours = OperatingHours - ?, UpdatedAt = datetime('now')
      WHERE Id = ?
    `).run(Math.round(existing.HoursUsed), existing.MachineId);

    db.prepare('DELETE FROM UsageLogs WHERE Id = ?').run(id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

