import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import MachineList from './pages/machines/MachineList';
import MachineDetail from './pages/machines/MachineDetail';
import MachineCreate from './pages/machines/MachineCreate';
import MachineEdit from './pages/machines/MachineEdit';
import MaintenanceRecordCreate from './pages/machines/MaintenanceRecordCreate';
import UsageLogCreate from './pages/machines/UsageLogCreate';
import Maintenance from './pages/Maintenance';
import UsageLogs from './pages/UsageLogs';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/machines" element={<MachineList />} />
        <Route path="/machines/create" element={<MachineCreate />} />
        <Route path="/machines/:id" element={<MachineDetail />} />
        <Route path="/machines/edit/:id" element={<MachineEdit />} />
        <Route path="/machines/:id/maintenance/create" element={<MaintenanceRecordCreate />} />
        <Route path="/machines/:id/usage/create" element={<UsageLogCreate />} />
        <Route path="/maintenance" element={<Maintenance />} />
        <Route path="/usage-logs" element={<UsageLogs />} />
      </Routes>
    </Layout>
  );
}

export default App;

