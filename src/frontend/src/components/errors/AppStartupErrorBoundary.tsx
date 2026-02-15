import React, { Component, ReactNode } from 'react';
import StartupErrorScreen from './StartupErrorScreen';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export default class AppStartupErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error details for debugging (avoid exposing sensitive info)
    console.error('App startup error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <StartupErrorScreen />;
    }

    return this.props.children;
  }
}
