import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { BrowserRouter } from 'react-router-dom';
import { getStoredTheme, applyTheme } from './utils/theme';
import ErrorBoundary from './components/ErrorBoundary.tsx';

applyTheme(getStoredTheme());

createRoot(document.getElementById('root')!).render(
  <ErrorBoundary>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </ErrorBoundary>,
);
