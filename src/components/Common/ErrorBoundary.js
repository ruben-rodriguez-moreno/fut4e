import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || 
        <div className="error-boundary">
          <h2>Algo salió mal</h2>
          <p>Por favor, intenta recargar la página.</p>
        </div>;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
