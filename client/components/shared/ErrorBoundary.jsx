"use client";

import React from "react";
import { Button } from "@/components/ui/button";

class GlobalErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.error("Uncaught error:", error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className="flex h-screen w-full flex-col items-center justify-center bg-gray-50 p-4 text-center">
          <div className="max-w-md space-y-4 rounded-lg bg-white p-8 shadow-lg">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-red-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              Something went wrong
            </h2>
            <p className="text-gray-500">
              We apologize for the inconvenience. The application has
              encountered an unexpected error.
            </p>
            {process.env.NODE_ENV === "development" && this.state.error && (
              <div className="mt-4 max-h-40 overflow-auto rounded bg-gray-100 p-2 text-left text-xs text-red-800">
                <p className="font-mono">{this.state.error.toString()}</p>
                <details className="mt-1 whitespace-pre-wrap">
                  {this.state.errorInfo?.componentStack}
                </details>
              </div>
            )}
            <div className="pt-4">
              <Button onClick={this.handleReload} className="w-full">
                Reload Application
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default GlobalErrorBoundary;
