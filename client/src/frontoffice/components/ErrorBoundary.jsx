import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.log("Uncaught error:", error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
          <div className="max-w-lg w-full text-center space-y-4">
            <h1 className="text-4xl font-bold text-red-600">Oops!</h1>
            <h2 className="text-2xl font-semibold text-gray-900">
              Something went wrong.
            </h2>
            <p className="text-gray-600">
              We encountered an unexpected error. Please try refreshing the
              page.
            </p>
            {this.state.error && (
              <pre className="text-left bg-gray-100 p-4 rounded overflow-auto text-xs text-red-500 mt-4">
                {this.state.error.toString()}
                {this.state.errorInfo && this.state.errorInfo.componentStack}
              </pre>
            )}
            <button
              onClick={() => window.location.reload()}
              className="mt-6 px-6 py-2 bg-primary text-white font-bold rounded hover:bg-green-700 transition"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
