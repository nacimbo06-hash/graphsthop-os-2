import React, { Suspense, lazy, useEffect, Component, ErrorInfo } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// i18n must be imported before any component that uses translations
import './i18n/config';

// Context Providers
import { SettingsProvider } from './contexts/SettingsContext';
import { ToastProvider } from './components/feedback/Toast';
import { SyncProvider } from './providers/SyncProvider';
import { DBProvider } from './providers/DBProvider';

// Auth Store
import { useAuthStore } from '@bonilo/shared/stores';

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

import { ROUTES } from '@bonilo/shared/constants';

// Loading Fallback Component
const PageLoader: React.FC = () => (
  <div style={{
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#FDFBF7',
    gap: '16px',
  }}>
    <div style={{
      width: '40px',
      height: '40px',
      border: '3px solid #E8E2D9',
      borderTopColor: '#3D7C4F',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
    }} />
    <span style={{ fontSize: '14px', fontWeight: 600, color: '#2C2C2C', fontFamily: "'Nunito', sans-serif" }}>Chargement...</span>
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </div>
);

// Global Error Boundary — prevents one crashed page from killing the app
interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<{ children: React.ReactNode }, ErrorBoundaryState> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[Bonilo] Page crashed:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#FDFBF7',
          gap: '20px',
          fontFamily: "'Nunito', sans-serif",
          padding: '40px',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '48px' }}>😵</div>
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#2C2C2C', margin: 0 }}>Une erreur est survenue</h2>
          <p style={{ fontSize: '14px', color: '#6B7280', maxWidth: '400px', margin: 0, lineHeight: 1.6 }}>
            {this.state.error?.message || 'Erreur inconnue'}
          </p>
          <button
            onClick={() => {
              this.setState({ hasError: false, error: null });
              window.location.hash = '#/';
            }}
            style={{
              padding: '10px 24px',
              background: '#3D7C4F',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: "'Nunito', sans-serif",
            }}
          >
            Retour au tableau de bord
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

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
    return <PageLoader />;
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
            <Route index element={<ErrorBoundary><Dashboard /></ErrorBoundary>} />
            <Route path="pos" element={<ErrorBoundary><POS /></ErrorBoundary>} />
            <Route path="treasury" element={<ErrorBoundary><Treasury /></ErrorBoundary>} />
            <Route path="inventory" element={<ErrorBoundary><Inventory /></ErrorBoundary>} />
            <Route path="customers" element={<ErrorBoundary><Customers /></ErrorBoundary>} />
            <Route path="suppliers" element={<ErrorBoundary><Suppliers /></ErrorBoundary>} />
            <Route path="print" element={<ErrorBoundary><PrintCenter /></ErrorBoundary>} />
            <Route path="reports" element={<ErrorBoundary><ReportsHub /></ErrorBoundary>} />
            <Route path="settings" element={<ErrorBoundary><Settings /></ErrorBoundary>} />
            <Route path="users" element={<ErrorBoundary><UsersManagement /></ErrorBoundary>} />
            <Route path="help" element={<ErrorBoundary><Help /></ErrorBoundary>} />
          </Route>

          {/* Catch all - redirect to home or login */}
          <Route path="*" element={<Navigate to={isAuthenticated ? ROUTES.ROOT : ROUTES.LOGIN} replace />} />
        </>
      )}
    </Routes>
  );
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SettingsProvider>
        <DBProvider>
          <SyncProvider>
            <ToastProvider>
              <HashRouter>
                <ErrorBoundary>
                  <Suspense fallback={<PageLoader />}>
                    <AppContent />
                  </Suspense>
                </ErrorBoundary>
              </HashRouter>
            </ToastProvider>
          </SyncProvider>
        </DBProvider>
      </SettingsProvider>
    </QueryClientProvider>
  );
}

export default App;
