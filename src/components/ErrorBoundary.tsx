import React from 'react';
import { motion } from 'framer-motion';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="w-screen h-screen flex items-center justify-center bg-white/70 backdrop-blur-sky">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md p-8 bg-white/80 backdrop-blur-md rounded-sky border border-sky-border shadow-sky"
          >
            <div className="text-4xl mb-4">⚠️</div>
            <h2 className="text-xl font-semibold text-sky-text mb-2">
              Something went wrong
            </h2>
            <p className="text-sky-text-secondary mb-4">
              The application encountered an error. Please try restarting.
            </p>
            <pre className="text-xs bg-red-50 text-red-600 p-3 rounded-lg overflow-auto max-h-32">
              {this.state.error?.message}
            </pre>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 w-full px-4 py-2 bg-sky-accent text-white rounded-lg hover:bg-sky-accent/90 transition-colors"
            >
              Reload Application
            </button>
          </motion.div>
        </div>
      );
    }

    return this.props.children;
  }
}
