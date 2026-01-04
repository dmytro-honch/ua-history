import { Component, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Caught error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="error__container">
          <div className="error__content">
            <h2 className="error__title">Something went wrong</h2>
            <p className="error__message">{this.state.error?.message}</p>
            <button className="error__button" onClick={() => this.setState({ hasError: false, error: null })}>
              Try one more time
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
