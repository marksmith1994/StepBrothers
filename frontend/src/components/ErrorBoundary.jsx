import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ error, errorInfo });
    
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error caught by boundary:', error, errorInfo);
    }
    
    // In production, you could send this to an error reporting service
    // Example: Sentry.captureException(error, { extra: errorInfo });
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: '#fff',
          padding: 32, textAlign: 'center'
        }}>
          <h1 style={{ fontSize: '2.5rem', marginBottom: 16 }}>😢 Oops! Something went wrong.</h1>
          <p style={{ fontSize: '1.2rem', marginBottom: 24 }}>
            An unexpected error occurred. Please try reloading the page.<br/>
            If the problem persists, contact support.
          </p>
          <button
            onClick={this.handleReload}
            style={{
              background: '#fff', color: '#764ba2', border: 'none', borderRadius: 8, padding: '12px 32px',
              fontWeight: 700, fontSize: '1rem', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}
          >
            Reload Page
          </button>
          {this.state.error && (
            <details style={{ marginTop: 32, color: '#fff', opacity: 0.7, maxWidth: 600 }}>
              <summary style={{ cursor: 'pointer', fontWeight: 600 }}>Error Details</summary>
              <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', marginTop: 8 }}>
                {this.state.error && this.state.error.toString()}
                {'\n'}
                {this.state.errorInfo && this.state.errorInfo.componentStack}
              </pre>
            </details>
          )}
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary; 