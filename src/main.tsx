import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { App } from './App';

// Dark-only experience — keep the theme class pinned regardless of any
// previously stored preference.
document.documentElement.classList.add('dark');
document.documentElement.style.setProperty('color-scheme', 'dark');

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
