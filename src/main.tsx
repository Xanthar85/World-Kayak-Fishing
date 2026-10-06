// src/main.tsx
// WKF — Punto de entrada. Sin cambios funcionales en v1.010.

import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './i18n/index.ts';
import './styles/global.css';
import './styles/theme.css';

createRoot(document.getElementById('root')!).render(<App />);