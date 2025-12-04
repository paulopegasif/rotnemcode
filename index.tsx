import './index.css';

import React from 'react';
import ReactDOM from 'react-dom/client';

import { Router } from './Router';
import { AuthProvider } from './contexts/AuthContext';
import './lib/supabaseTest'; // Expose testSupabaseConnection() to window

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Could not find root element to mount to');
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <AuthProvider>
      <Router />
    </AuthProvider>
  </React.StrictMode>
);
