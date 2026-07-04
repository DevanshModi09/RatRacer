import { Component, type ErrorInfo, type ReactNode } from 'react';
import { RefreshCw, TriangleAlert } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Unhandled UI error:', error, info.componentStack);
  }

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    return (
      <div className="min-h-screen flex items-center justify-center bg-base-100 px-4">
        <div className="max-w-md w-full text-center space-y-4">
          <div className="mx-auto size-14 rounded-2xl bg-error/10 flex items-center justify-center">
            <TriangleAlert className="size-7 text-error" aria-hidden="true" />
          </div>
          <h1 className="text-2xl font-bold">Something went wrong</h1>
          <p className="text-base-content/60">
            RatRacer hit an unexpected error. Reloading the page usually fixes it.
          </p>
          <button
            type="button"
            className="btn btn-primary gap-2"
            onClick={() => window.location.reload()}
          >
            <RefreshCw className="size-4" aria-hidden="true" />
            Reload
          </button>
        </div>
      </div>
    );
  }
}
