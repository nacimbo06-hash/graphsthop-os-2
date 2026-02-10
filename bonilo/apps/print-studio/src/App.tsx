import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppShell } from './components/layout';
import { Designer } from './pages/Designer';
import { Templates } from './pages/Templates';
import { Products } from './pages/Products';
import './styles/design-system.css';

// Placeholder pages
const PlaceholderPage = ({ title, description }: { title: string; description: string }) => (
  <div style={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    gap: '1rem',
    color: 'var(--color-text-primary)'
  }}>
    <h1 style={{ fontSize: '2.5rem', fontWeight: 700 }}>{title}</h1>
    <p style={{ color: 'var(--color-text-muted)' }}>{description}</p>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppShell />}>
          <Route index element={<Designer />} />
          <Route path="templates" element={<Templates />} />
          <Route path="products" element={<Products />} />
          <Route path="print" element={
            <PlaceholderPage
              title="Impression"
              description="File d'attente et historique d'impression"
            />
          } />
          <Route path="settings" element={
            <PlaceholderPage
              title="Paramètres"
              description="Configuration des imprimantes et préférences"
            />
          } />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
