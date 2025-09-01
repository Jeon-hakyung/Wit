'use client';

import { logoutUser } from '@/actions/auth';
import { AuthError, errorLogger } from '@/libs/errors';
import React, { Component, ReactNode, useTransition } from 'react';

interface ErrorFallbackProps {
  error?: Error;
  // eslint-disable-next-line react/no-unused-prop-types
  errorInfo?: React.ErrorInfo;
  onRetry: () => void;
  onReload: () => void;
}

const ErrorFallback: React.FC<ErrorFallbackProps> = ({
  error,
  onRetry,
  onReload,
}) => {
  const isAuthError = error instanceof AuthError;
  const [isPending, startTransition] = useTransition();

  const handleLogout = () => {
    startTransition(() => {
      logoutUser();
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-[600px] rounded-lg bg-white p-8 shadow-lg">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <svg
              className="h-6 w-6 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>

          <h2 className="mb-4 text-xl font-semibold text-gray-900">
            문제가 발생했습니다
          </h2>

          <div className="mb-6 text-sm text-gray-600">
            {isAuthError ? (
              <div>
                <p className="mb-3">{error.getUserMessage()}</p>
                <div className="rounded-md bg-blue-50 p-3 text-left">
                  <p className="mb-2 font-medium text-blue-800">해결 방법:</p>
                  <ul className="space-y-1 text-blue-700">
                    <li>• 페이지를 새로고침해 보세요</li>
                    <li>• 잠시 후 다시 시도해 보세요</li>
                    <li>• 문제가 지속되면 고객센터에 문의해 주세요</li>
                  </ul>
                </div>
              </div>
            ) : (
              <p>
                예상치 못한 오류가 발생했습니다.
                <br />
                문제가 지속되면 페이지를 새로고침해 주세요.
              </p>
            )}
          </div>

          <div className="space-y-3">
            <button
              type="button"
              onClick={onRetry}
              className="w-full rounded-md bg-kakao-yellow px-4 py-2 text-sm font-semibold text-wit-black shadow-sm transition-colors duration-200 hover:bg-opacity-90"
            >
              다시 시도
            </button>

            <button
              type="button"
              onClick={onReload}
              className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm transition-colors duration-200 hover:bg-gray-50"
            >
              페이지 새로고침
            </button>

            <button
              type="button"
              onClick={handleLogout}
              disabled={isPending}
              className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm transition-colors duration-200 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isPending ? '로그아웃 중...' : '로그아웃'}
            </button>

            <button
              type="button"
              onClick={() => {
                window.location.href = '/';
              }}
              className="w-full text-sm text-gray-500 transition-colors duration-200 hover:text-gray-700"
            >
              홈으로 돌아가기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    const { onError } = this.props;
    this.setState({
      error,
      errorInfo,
    });

    errorLogger.logError(error, {
      errorInfo,
      componentStack: errorInfo.componentStack,
      errorBoundary: 'ErrorBoundary',
    });

    if (onError) {
      onError(error, errorInfo);
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    const { hasError, error, errorInfo } = this.state;
    const { fallback, children } = this.props;

    if (hasError) {
      if (fallback) {
        return fallback;
      }

      return (
        <ErrorFallback
          error={error}
          errorInfo={errorInfo}
          onRetry={this.handleRetry}
          onReload={this.handleReload}
        />
      );
    }

    return children;
  }
}
