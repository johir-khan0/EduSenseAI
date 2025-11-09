
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import ErrorBoundary from './components/ErrorBoundary';

// Show a visible overlay with error details for uncaught errors so we don't get a blank screen.
function showGlobalErrorOverlay(message: string) {
  try {
    let el = document.getElementById('global-error-overlay');
    if (!el) {
      el = document.createElement('div');
      el.id = 'global-error-overlay';
      Object.assign(el.style, {
        position: 'fixed',
        zIndex: '999999',
        left: '12px',
        right: '12px',
        top: '12px',
        padding: '16px',
        background: 'rgba(255,248,240,0.98)',
        color: '#7f1d1d',
        border: '1px solid #fca5a5',
        borderRadius: '8px',
        boxShadow: '0 6px 18px rgba(0,0,0,0.12)',
        fontFamily: 'system-ui, sans-serif',
        fontSize: '13px',
        overflow: 'auto',
        maxHeight: '60vh'
      });
      document.body.appendChild(el);
    }
    el.textContent = message;
  } catch (err) {
    // ignore
    // eslint-disable-next-line no-console
    console.error('Failed to show global error overlay', err);
  }
}

window.addEventListener('error', (ev) => {
  const e = ev.error as any;
  const msg = e ? `${e.message}\n${e.stack || ''}` : `Error: ${ev.message}`;
  console.error('Window error:', ev.error || ev.message, ev);
  showGlobalErrorOverlay(msg);
});

window.addEventListener('unhandledrejection', (ev) => {
  const reason: any = (ev as any).reason;
  const msg = reason ? (reason.message || String(reason)) : 'Unhandled promise rejection';
  console.error('Unhandled rejection:', reason);
  showGlobalErrorOverlay(msg + (reason && reason.stack ? `\n${reason.stack}` : ''));
});

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
