import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const machineService = {
  getAll: () => api.get('/machines'),
  getById: (id) => api.get(`/machines/${id}`),
  getBySerialNumber: (serialNumber) => api.get(`/machines/serial/${serialNumber}`),
  create: (data) => api.post('/machines', data),
  update: (id, data) => api.put(`/machines/${id}`, data),
  delete: (id) => api.delete(`/machines/${id}`),
};

export const maintenanceService = {
  getAll: () => api.get('/maintenance'),
  getById: (id) => api.get(`/maintenance/${id}`),
  getByMachine: (machineId) => api.get(`/maintenance/machine/${machineId}`),
  create: (data) => api.post('/maintenance', data),
  update: (id, data) => api.put(`/maintenance/${id}`, data),
  delete: (id) => api.delete(`/maintenance/${id}`),
};

export const usageLogService = {
  getAll: () => api.get('/usage-logs'),
  getById: (id) => api.get(`/usage-logs/${id}`),
  getByMachine: (machineId) => api.get(`/usage-logs/machine/${machineId}`),
  create: (data) => api.post('/usage-logs', data),
  update: (id, data) => api.put(`/usage-logs/${id}`, data),
  delete: (id) => api.delete(`/usage-logs/${id}`),
};

export default api;

