import React, { Suspense, lazy, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { seedMockData } from './data/mockData';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// i18n must be imported before any component that uses translations
import './i18n/config';

// Context Providers
import { SettingsProvider } from './contexts/SettingsContext';
import { ToastProvider } from './components/feedback/Toast';
import { SyncProvider } from './providers/SyncProvider';
import { DBProvider } from './providers/DBProvider';

// Auth Store
import { useAuthStore } from '@asgard/shared/stores';

// Layout (keep eager - shared across all routes)
import { MainLayout } from './components/layout/MainLayout';

// Lazy-loaded Pages (code-splitting)
const Dashboard = lazy(() => import('./pages/Dashboard').then(m => ({ default: m.Dashboard })));
const POS = lazy(() => import('./pages/POS').then(m => ({ default: m.POS })));
const Treasury = lazy(() => import('./pages/Treasury').then(m => ({ default: m.Treasury })));
const Inventory = lazy(() => import('./pages/Inventory').then(m => ({ default: m.Inventory })));
const Customers = lazy(() => import('./pages/Customers').then(m => ({ default: m.Customers })));
const Suppliers = lazy(() => import('./pages/Suppliers').then(m => ({ default: m.Suppliers })));
const PrintCenter = lazy(() => import('./pages/PrintCenter').then(m => ({ default: m.PrintCenter })));
const ReportsHub = lazy(() => import('./pages/Reports').then(m => ({ default: m.ReportsHub })));
const Settings = lazy(() => import('./pages/Settings').then(m => ({ default: m.Settings })));
const Help = lazy(() => import('./pages/Help').then(m => ({ default: m.Help })));
const Login = lazy(() => import('./pages/Login').then(m => ({ default: m.Login })));
const UsersManagement = lazy(() => import('./pages/Users').then(m => ({ default: m.UsersManagement })));
const Onboarding = lazy(() => import('./pages/Onboarding/Onboarding').then(m => ({ default: m.Onboarding })));

// Styles
import './styles/globals.css';
import { useSettings } from './contexts/SettingsContext';

import { ROUTES } from '@asgard/shared/constants';

// Loading Fallback Component
const PageLoader: React.FC = () => (
  <div style={{
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'var(--bg-primary, #0f172a)'
  }}>
    <div className="spinner"></div>
  </div>
);

// Create React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 3,
      refetchOnWindowFocus: false,
    },
  },
});

// Protected Route Component
interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  return <>{children}</>;
};

// Onboarding Guard
const AppContent: React.FC = () => {
  const { storeSettings, settings } = useSettings();
  const { isAuthenticated, allUsers } = useAuthStore();

  // Safety check to ensure settings are available
  if (!settings || !storeSettings) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f172a' }}>
        <div className="spinner"></div>
      </div>
    );
  }

  // Check if this is a fresh install (no store name configured AND no users created)
  const needsOnboarding = !storeSettings.name || allUsers.length === 0;

  return (
    <Routes>
      {/* Setup Route - Show onboarding if store not configured */}
      <Route
        path={ROUTES.ONBOARDING}
        element={needsOnboarding ? <Onboarding /> : <Navigate to={ROUTES.ROOT} replace />}
      />

      {/* Force onboarding if not configured */}
      {needsOnboarding && (
        <>
          <Route path={ROUTES.LOGIN} element={<Navigate to={ROUTES.ONBOARDING} replace />} />
          <Route path="*" element={<Navigate to={ROUTES.ONBOARDING} replace />} />
        </>
      )}

      {/* Normal routes when configured */}
      {!needsOnboarding && (
        <>
          {/* Public Route - Login */}
          <Route path={ROUTES.LOGIN} element={isAuthenticated ? <Navigate to={ROUTES.ROOT} replace /> : <Login />} />

          {/* Protected Routes */}
          <Route
            path={ROUTES.ROOT}
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="pos" element={<POS />} />
            <Route path="treasury" element={<Treasury />} />
            <Route path="inventory" element={<Inventory />} />
            <Route path="customers" element={<Customers />} />
            <Route path="suppliers" element={<Suppliers />} />
            <Route path="print" element={<PrintCenter />} />
            <Route path="reports" element={<ReportsHub />} />
            <Route path="settings" element={<Settings />} />
            <Route path="users" element={<UsersManagement />} />
            <Route path="help" element={<Help />} />
          </Route>

          {/* Catch all - redirect to home or login */}
          <Route path="*" element={<Navigate to={isAuthenticated ? ROUTES.ROOT : ROUTES.LOGIN} replace />} />
        </>
      )}
    </Routes>
  );
};

function App() {
  // Seed mock data on app startup (only runs once, checks if stores are empty)
  // DISABLED FOR PRODUCTION BUILD - NO MOCK DATA
  /* 
  useEffect(() => {
    seedMockData();
  }, []);
  */

  return (
    <QueryClientProvider client={queryClient}>
      <SettingsProvider>
        <DBProvider>
          <SyncProvider>
            <ToastProvider>
              <HashRouter>
                <Suspense fallback={<PageLoader />}>
                  <AppContent />
                </Suspense>
              </HashRouter>
            </ToastProvider>
          </SyncProvider>
        </DBProvider>
      </SettingsProvider>
    </QueryClientProvider>
  );
}

export default App;
