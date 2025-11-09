import React from 'react';

// Use a loose-typed ErrorBoundary to avoid strict TS React typing issues in this repo.
class ErrorBoundary extends (React as any).Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null, info: null };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }

  componentDidCatch(error: any, info: any) {
    console.error('Uncaught error in React tree:', error, info);
    this.setState({ hasError: true, error, info });
  }

  render() {
    if (this.state && this.state.hasError) {
      return (
        <div style={{ padding: 24 }}>
          <h1 style={{ color: '#b91c1c' }}>An unexpected error occurred</h1>
          <p style={{ color: '#374151' }}>{this.state.error?.message}</p>
          <details style={{ whiteSpace: 'pre-wrap', marginTop: 12 }}>
            {this.state.info?.componentStack}
          </details>
          <div style={{ marginTop: 16 }}>
            <button onClick={() => window.location.reload()} style={{ padding: '8px 12px', borderRadius: 6 }}>Reload</button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
