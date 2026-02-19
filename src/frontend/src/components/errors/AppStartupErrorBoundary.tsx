import React, { Component, ErrorInfo, ReactNode } from 'react';
import { StartupErrorScreen } from './StartupErrorScreen';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class AppStartupErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
    console.log('[AppStartupErrorBoundary] Initialized');
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    console.error('[AppStartupErrorBoundary] getDerivedStateFromError called:', error);
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const errorDetails = {
      error,
      errorInfo,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
    };

    console.error('[AppStartupErrorBoundary] Caught error:', errorDetails);

    // Log to console in a formatted way
    console.group('🚨 Application Startup Error');
    console.error('Error:', error.message);
    console.error('Stack:', error.stack);
    console.error('Component Stack:', errorInfo.componentStack);
    console.error('Timestamp:', errorDetails.timestamp);
    console.error('User Agent:', errorDetails.userAgent);
    console.error('URL:', errorDetails.url);
    console.groupEnd();

    this.setState({
      error,
      errorInfo,
    });
  }

  handleReload = () => {
    console.log('[AppStartupErrorBoundary] Reloading application');
    // Clear all cached state before reload
    try {
      sessionStorage.clear();
      localStorage.clear();
      console.log('[AppStartupErrorBoundary] Cleared storage');
    } catch (error) {
      console.error('[AppStartupErrorBoundary] Failed to clear storage:', error);
    }
    window.location.href = window.location.pathname;
  };

  render() {
    if (this.state.hasError) {
      console.log('[AppStartupErrorBoundary] Rendering error screen');
      return (
        <StartupErrorScreen
          error={this.state.error}
          errorInfo={this.state.errorInfo}
          onReload={this.handleReload}
        />
      );
    }

    return this.props.children;
  }
}
