import { Component, type ReactNode, type ErrorInfo } from 'react';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
    onError?: (error: Error, errInfo: ErrorInfo) => void;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            hasError: false,
            error: null
        }
    }

    static getDerivedStateFromError(error: Error): State {
        return {
            hasError: true,
            error
        };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
        console.error('CenterModal ErrorBounday caught an error: ', error, errorInfo);
        this.props.onError?.(error, errorInfo);
    }

    render(): ReactNode {
        if (this.state.hasError) {
            return this.props.fallback ?? <h2>Error at Center Modal Boundary</h2>;
        }

        return this.props.children;
    }
}

export default ErrorBoundary;