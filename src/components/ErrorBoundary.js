import React from 'react';
import PropTypes from 'prop-types';
import logger from '../utils/logger';
import Button from './ui/Button';
import './ErrorBoundary.css';

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
        <div className="error-boundary">
          <h2 className="error-boundary__title">
            ⚠️ Algo deu errado
          </h2>
          <p className="error-boundary__text">
            Ocorreu um erro inesperado. Por favor, recarregue a página.
          </p>
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <details className="error-boundary__details">
              <summary className="error-boundary__summary">
                Detalhes do erro (apenas em desenvolvimento)
              </summary>
              <pre className="error-boundary__stack">
                {this.state.error.toString()}
                {this.state.errorInfo && this.state.errorInfo.componentStack}
              </pre>
            </details>
          )}
          <Button
            onClick={this.handleReload}
            variant="primary"
          >
            Recarregar Página
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ErrorBoundary;
