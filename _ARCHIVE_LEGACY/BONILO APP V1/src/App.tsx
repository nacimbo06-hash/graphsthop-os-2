import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from './components/layout/MainLayout';
import { Dashboard } from './pages/Dashboard/Dashboard';
import Onboarding from './pages/Onboarding/Onboarding';
import CircularityPage from './pages/Circularity/Circularity';
import { ROUTES } from '@core/constants';

// Simulated Page Components for the Rebuild
const POSPage = () => <div className="p-8">POS Terminal View (Active)</div>;
const InventoryPage = () => <div className="p-8">Inventory Management View (Active)</div>;
const CopilotPage = () => <div className="p-8">AI Store Manager Copilot (Active)</div>;

function App() {
  return (
    <Router>
      <Routes>
        {/* Public / Onboarding Routes */}
        <Route path={ROUTES.ONBOARDING} element={<Onboarding />} />

        {/* Protected App Layout */}
        <Route element={<MainLayout />}>
          <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
          <Route path={ROUTES.POS} element={<POSPage />} />
          <Route path={ROUTES.INVENTORY} element={<InventoryPage />} />
          <Route path={ROUTES.CIRCULARITY} element={<CircularityPage />} />
          <Route path={ROUTES.COPILOT} element={<CopilotPage />} />

          {/* Fallback to Dashboard */}
          <Route path="*" element={<Navigate to={ROUTES.DASHBOARD} replace />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
