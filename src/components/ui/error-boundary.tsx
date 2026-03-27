import { Component, type ErrorInfo, type ReactNode } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("ErrorBoundary caught:", error, info.componentStack);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className="flex min-h-[50vh] items-center justify-center px-4">
          <div className="text-center">
            <div className="bg-destructive/10 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
              <AlertTriangle className="text-destructive h-8 w-8" />
            </div>
            <h2 className="mb-2 text-xl font-semibold">
              Đã xảy ra lỗi
            </h2>
            <p className="text-muted-foreground mb-6 max-w-md text-sm">
              Có lỗi xảy ra khi tải trang. Vui lòng thử tải lại hoặc quay
              về trang chủ.
            </p>
            <div className="flex justify-center gap-3">
              <Button onClick={this.handleReset} variant="outline">
                <RefreshCw className="mr-2 h-4 w-4" />
                Thử lại
              </Button>
              <Button onClick={() => (window.location.href = "/")}>
                Về trang chủ
              </Button>
            </div>
            {import.meta.env.DEV && this.state.error && (
              <pre className="bg-muted mt-6 max-w-lg overflow-auto rounded-lg p-4 text-left text-xs">
                {this.state.error.message}
              </pre>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
