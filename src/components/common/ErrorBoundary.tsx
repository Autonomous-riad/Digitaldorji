import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
  fallbackMessage?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public override state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error caught by ErrorBoundary:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  private handleGoHome = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  public override render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[400px] flex items-center justify-center p-6 bg-purple-50/50">
          <div className="max-w-md w-full bg-white rounded-2xl p-8 border border-red-100 shadow-xl text-center">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <h2 className="text-xl font-bold text-purple-950 mb-1">
              কিছু একটা সমস্যা হয়েছে
            </h2>
            <p className="text-sm text-purple-600 mb-6">
              দুঃখিত! অ্যাপ্লিকেশনটি লোড করার সময় একটি ত্রুটি দেখা দিয়েছে। পৃষ্ঠাটি রিলোড করে পুনরায় চেষ্টা করুন।
            </p>

            {this.state.error && (
              <div className="text-left bg-purple-50 p-3 rounded-lg text-xs font-mono text-purple-800 overflow-x-auto mb-6 max-h-32 border border-purple-200">
                {this.state.error.message}
              </div>
            )}

            <div className="flex gap-3 justify-center">
              <button
                onClick={this.handleReset}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-orange-700 hover:bg-orange-800 text-white font-medium text-sm transition-colors cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                রিলোড দিন
              </button>
              <button
                onClick={this.handleGoHome}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-purple-100 hover:bg-purple-200 text-purple-800 font-medium text-sm transition-colors cursor-pointer"
              >
                <Home className="w-4 h-4" />
                হোমে ফিরে যান
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
