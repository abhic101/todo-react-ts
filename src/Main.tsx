import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Root element not found');

if (import.meta.env.VITE_ENV === 'prd') {
        createRoot(rootElement).render(
                <App />
        )
} else {
        createRoot(rootElement).render(
                <StrictMode>
                        <App />
                </StrictMode>
        )
}