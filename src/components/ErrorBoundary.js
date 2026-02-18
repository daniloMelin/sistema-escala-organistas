import React from 'react';
import logger from '../utils/logger';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    logger.error('Error caught by boundary:', { error, errorInfo });
    this.setState({
      error,
      errorInfo
    });
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ 
          padding: '40px 20px', 
          textAlign: 'center', 
          maxWidth: '600px', 
          margin: '50px auto',
          background: '#fff',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ color: '#dc3545', marginBottom: '20px' }}>
            ⚠️ Algo deu errado
          </h2>
          <p style={{ color: '#666', marginBottom: '30px' }}>
            Ocorreu um erro inesperado. Por favor, recarregue a página.
          </p>
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <details style={{ 
              textAlign: 'left', 
              marginBottom: '20px',
              padding: '15px',
              background: '#f8f9fa',
              borderRadius: '4px',
              fontSize: '0.9em'
            }}>
              <summary style={{ cursor: 'pointer', fontWeight: 'bold', marginBottom: '10px' }}>
                Detalhes do erro (apenas em desenvolvimento)
              </summary>
              <pre style={{ 
                overflow: 'auto', 
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                color: '#dc3545'
              }}>
                {this.state.error.toString()}
                {this.state.errorInfo && this.state.errorInfo.componentStack}
              </pre>
            </details>
          )}
          <button
            onClick={this.handleReload}
            style={{
              padding: '12px 24px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '16px'
            }}
          >
            Recarregar Página
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
