import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-black flex flex-col items-center justify-center p-8 text-white font-mono">
                    <h1 className="text-4xl font-bold text-red-600 mb-4 animate-pulse">SYSTEM_FAILURE</h1>
                    <div className="bg-zinc-900 border border-red-900/50 p-6 rounded-lg max-w-2xl w-full overflow-auto">
                        <p className="text-red-400 font-bold mb-2">Error Log:</p>
                        <pre className="text-xs text-red-200 whitespace-pre-wrap font-mono">
                            {this.state.error && this.state.error.toString()}
                        </pre>
                    </div>
                    <button
                        onClick={() => window.location.href = '/'}
                        className="mt-8 px-6 py-2 border border-white/20 hover:bg-white/10 rounded uppercase text-xs tracking-widest"
                    >
                        Reboot System
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}
