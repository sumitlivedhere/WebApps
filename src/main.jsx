import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { initRealtimeSubscriptions, hydrateFromDB } from './store/hyperlocalStore';

// 1. Establish persistent WebSockets listener for live town feeds & threads
initRealtimeSubscriptions();

// 2. Hydrate existing database listings from PostgreSQL into store
hydrateFromDB();

const rootElement = document.getElementById('root');

if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
}