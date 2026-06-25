import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Buffer } from 'buffer';
import App from './app/App';
import './styles/globals.css';

// gray-matter (used by Kanban markdown parser) expects Node's Buffer globally.
// `buffer` package provides a browser-compatible implementation.
if (typeof (globalThis as { Buffer?: unknown }).Buffer === 'undefined') {
  (globalThis as { Buffer: typeof Buffer }).Buffer = Buffer;
}

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Root element #root not found in index.html');

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);