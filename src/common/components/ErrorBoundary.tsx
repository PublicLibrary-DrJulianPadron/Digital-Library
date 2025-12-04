import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/common/components/ui/button';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error?: Error;
    errorInfo?: ErrorInfo;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo);
        this.setState({
            error,
            errorInfo
        });
    }

    private handleReset = () => {
        this.setState({ hasError: false, error: undefined, errorInfo: undefined });
    };

    public render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-biblioteca-blue via-background to-biblioteca-gray p-4 relative overflow-hidden">
                    {/* Animated background pattern */}
                    <div className="absolute inset-0 bg-celosia-pattern opacity-10 animate-pulse"></div>

                    {/* Floating orbs for visual interest */}
                    <div className="absolute top-20 left-20 w-64 h-64 bg-biblioteca-gold/20 rounded-full blur-3xl animate-parallax"></div>
                    <div className="absolute bottom-20 right-20 w-96 h-96 bg-biblioteca-red/10 rounded-full blur-3xl animate-parallax" style={{ animationDelay: '2s' }}></div>

                    {/* Main error card */}
                    <div className="max-w-md w-full relative z-10 animate-fade-in">
                        <div className="bg-card/95 backdrop-blur-xl border border-border/50 rounded-2xl shadow-2xl p-8 text-center">
                            {/* Icon with pulse animation */}
                            <div className="mb-6 relative">
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-20 h-20 bg-destructive/20 rounded-full animate-ping"></div>
                                </div>
                                <AlertTriangle className="h-16 w-16 text-destructive mx-auto relative z-10 drop-shadow-lg" />
                            </div>

                            {/* Title with gradient */}
                            <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-destructive to-biblioteca-red bg-clip-text text-transparent">
                                Algo salió mal
                            </h1>

                            {/* Description */}
                            <p className="text-muted-foreground mb-6 text-base leading-relaxed">
                                Lo sentimos, ha ocurrido un error inesperado en la aplicación.
                            </p>

                            {/* Error message box */}
                            {this.state.error && (
                                <div className="bg-muted/50 backdrop-blur-sm border border-destructive/20 p-4 rounded-lg mb-6 text-left transition-all hover:border-destructive/40">
                                    <p className="text-sm font-mono text-destructive break-words">
                                        {this.state.error.message}
                                    </p>
                                </div>
                            )}

                            {/* Action buttons */}
                            <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                <Button
                                    onClick={() => window.location.reload()}
                                    variant="default"
                                    className="group relative overflow-hidden bg-gradient-to-r from-biblioteca-blue to-biblioteca-blue/80 hover:from-biblioteca-blue/90 hover:to-biblioteca-blue/70 transition-all duration-300 shadow-lg hover:shadow-xl"
                                >
                                    <RefreshCw className="h-4 w-4 mr-2 group-hover:rotate-180 transition-transform duration-500" />
                                    Intentar de nuevo
                                </Button>
                                <Button
                                    onClick={() => window.location.href = '/'}
                                    variant="outline"
                                    className="group border-biblioteca-blue/30 hover:border-biblioteca-blue hover:bg-biblioteca-blue/10 transition-all duration-300"
                                >
                                    <Home className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform duration-300" />
                                    Regresar a Inicio
                                </Button>
                            </div>
                        </div>

                        {/* Decorative bottom accent */}
                        <div className="mt-4 flex justify-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-biblioteca-gold animate-pulse"></div>
                            <div className="w-2 h-2 rounded-full bg-biblioteca-gold animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                            <div className="w-2 h-2 rounded-full bg-biblioteca-gold animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
