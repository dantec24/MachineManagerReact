import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let db = null;

export function getDatabase() {
  if (!db) {
    const dbPath = join(__dirname, '..', 'machinemanager.db');
    db = new Database(dbPath);
    db.pragma('foreign_keys = ON');
  }
  return db;
}

export function initDatabase() {
  const database = getDatabase();

  // Create Machines table
  database.exec(`
    CREATE TABLE IF NOT EXISTS Machines (
      Id INTEGER PRIMARY KEY AUTOINCREMENT,
      Name TEXT NOT NULL,
      Model TEXT NOT NULL,
      SerialNumber TEXT NOT NULL UNIQUE,
      Type TEXT NOT NULL,
      Status TEXT NOT NULL,
      PurchaseDate TEXT NOT NULL,
      PurchasePrice REAL NOT NULL,
      LastMaintenanceDate TEXT,
      OperatingHours INTEGER NOT NULL DEFAULT 0,
      Notes TEXT,
      CreatedAt TEXT NOT NULL DEFAULT (datetime('now')),
      UpdatedAt TEXT
    )
  `);

  // Create MaintenanceRecords table
  database.exec(`
    CREATE TABLE IF NOT EXISTS MaintenanceRecords (
      Id INTEGER PRIMARY KEY AUTOINCREMENT,
      MachineId INTEGER NOT NULL,
      Type TEXT NOT NULL,
      Description TEXT NOT NULL,
      PerformedDate TEXT NOT NULL,
      NextDueDate TEXT,
      PerformedBy TEXT NOT NULL,
      Cost REAL NOT NULL DEFAULT 0,
      Notes TEXT,
      CreatedAt TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (MachineId) REFERENCES Machines(Id) ON DELETE CASCADE
    )
  `);

  // Create UsageLogs table
  database.exec(`
    CREATE TABLE IF NOT EXISTS UsageLogs (
      Id INTEGER PRIMARY KEY AUTOINCREMENT,
      MachineId INTEGER NOT NULL,
      OperatorName TEXT NOT NULL,
      StartTime TEXT NOT NULL,
      EndTime TEXT NOT NULL,
      HoursUsed REAL NOT NULL,
      JobDescription TEXT NOT NULL,
      Notes TEXT,
      CreatedAt TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (MachineId) REFERENCES Machines(Id) ON DELETE CASCADE
    )
  `);

  // Create indexes
  database.exec(`
    CREATE INDEX IF NOT EXISTS idx_MaintenanceRecords_MachineId ON MaintenanceRecords(MachineId);
    CREATE INDEX IF NOT EXISTS idx_MaintenanceRecords_PerformedDate ON MaintenanceRecords(PerformedDate);
    CREATE INDEX IF NOT EXISTS idx_UsageLogs_MachineId ON UsageLogs(MachineId);
    CREATE INDEX IF NOT EXISTS idx_UsageLogs_StartTime ON UsageLogs(StartTime);
  `);

  // Seed initial data if database is empty
  const machineCount = database.prepare('SELECT COUNT(*) as count FROM Machines').get();
  if (machineCount.count === 0) {
    seedDatabase(database);
  }

  console.log('Database initialized successfully');
}

function seedDatabase(database) {
  const insertMachine = database.prepare(`
    INSERT INTO Machines (Name, Model, SerialNumber, Type, Status, PurchaseDate, PurchasePrice, OperatingHours, Notes, CreatedAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
  `);

  const insertMaintenance = database.prepare(`
    INSERT INTO MaintenanceRecords (MachineId, Type, Description, PerformedDate, PerformedBy, Cost, Notes, CreatedAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'))
  `);

  const insertUsageLog = database.prepare(`
    INSERT INTO UsageLogs (MachineId, OperatorName, StartTime, EndTime, HoursUsed, JobDescription, Notes, CreatedAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'))
  `);

  const machine1 = insertMachine.run(
    'John Deere X350',
    'X350',
    'JD-X350-2023-001',
    'Mower',
    'Active',
    '2023-05-15',
    3499.99,
    125,
    'Primary mower for residential lawns'
  );

  const machine2 = insertMachine.run(
    'Stihl FS 56 RC-E',
    'FS 56 RC-E',
    'STIHL-FS56-2023-002',
    'Trimmer',
    'Active',
    '2023-06-01',
    199.99,
    45,
    'Lightweight trimmer for edges'
  );

  insertMaintenance.run(
    machine1.lastInsertRowid,
    'OilChange',
    'Regular oil change',
    '2024-01-15',
    'John Smith',
    25.00,
    'Used synthetic oil'
  );

  insertUsageLog.run(
    machine1.lastInsertRowid,
    'John Smith',
    '2024-01-20T08:00:00',
    '2024-01-20T12:00:00',
    4.0,
    'Residential lawn mowing',
    'Standard weekly maintenance'
  );
}
