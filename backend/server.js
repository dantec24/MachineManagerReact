import express from 'express';
import cors from 'cors';
import { initDatabase } from './database/db.js';
import machineRoutes from './routes/machines.js';
import maintenanceRoutes from './routes/maintenance.js';
import usageLogRoutes from './routes/usageLogs.js';

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize database
initDatabase();

// Routes
app.use('/api/machines', machineRoutes);
app.use('/api/maintenance', maintenanceRoutes);
app.use('/api/usage-logs', usageLogRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

