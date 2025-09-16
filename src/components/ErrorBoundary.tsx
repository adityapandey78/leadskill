"use client";
import { Component, ReactNode } from "react";

export class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error: any, info: any) {
    // Log error if needed
    // console.error(error, info);
  }
  render() {
    if (this.state.hasError) {
      return <div className="text-red-400 text-center py-8">Something went wrong. Please refresh the page.</div>;
    }
    return this.props.children;
  }
}
