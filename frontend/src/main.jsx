import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
// Load Prism theme once at the application level
import "prismjs/themes/prism-tomorrow.css";
// Initialize Prism
import Prism from 'prismjs';

// Add error boundary for better error handling
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Application error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 text-center mx-auto max-w-md">
          <h2 className="text-xl font-semibold mb-4 text-destructive">Something went wrong</h2>
          <p className="mb-4 text-muted-foreground">
            The application encountered an error. Please refresh the page and try again.
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Refresh Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Ensure Prism is loaded before the app starts
if (Prism) {
  console.log("Prism is loaded and ready");
  // Force Prism to initialize all components
  Prism.manual = false;
  if (typeof Prism.highlightAll === 'function') {
    Prism.highlightAll();
  }
}

// Get the root element
const rootElement = document.getElementById('root');

// Use createRoot with a fallback for testing environments
const root = ReactDOM.createRoot(rootElement);

// Render the app
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
