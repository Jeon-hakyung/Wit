/* eslint-disable max-classes-per-file */

import { ENV_CONFIG, LOG_LEVELS } from '@/constants/config';

type LogLevel = (typeof LOG_LEVELS)[keyof typeof LOG_LEVELS];

const getShouldLog = (level: LogLevel) => {
  const currentEnv = process.env.NODE_ENV || 'development';
  const config = ENV_CONFIG[currentEnv] || ENV_CONFIG.development;
  const logLevelOrder: LogLevel[] = [
    LOG_LEVELS.DEBUG,
    LOG_LEVELS.INFO,
    LOG_LEVELS.WARN,
    LOG_LEVELS.ERROR,
  ];
  return (
    logLevelOrder.indexOf(level) >= logLevelOrder.indexOf(config.LOG_LEVEL)
  );
};

class BaseError extends Error {
  public readonly timestamp: string;

  public readonly context?: Record<string, unknown>;

  constructor(
    message: string,
    options?: { cause?: Error; context?: Record<string, unknown> },
  ) {
    super(message, { cause: options?.cause });
    this.name = this.constructor.name;
    this.timestamp = new Date().toISOString();
    this.context = options?.context;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class AuthError extends BaseError {
  public readonly type: string;

  public readonly userMessage: string;

  public readonly recoverySuggestion: string;

  constructor(
    type: string,
    message: string,
    userMessage: string,
    recoverySuggestion: string,
    options?: { cause?: Error; context?: Record<string, unknown> },
  ) {
    super(message, options);
    this.type = type;
    this.userMessage = userMessage;
    this.recoverySuggestion = recoverySuggestion;
  }

  getUserMessage() {
    return this.userMessage;
  }
}

export const errorLogger = {
  logError: (
    error: Error,
    context?: Record<string, unknown>,
    level: LogLevel = LOG_LEVELS.ERROR,
  ) => {
    if (!getShouldLog(level)) {
      return;
    }

    const logObject = {
      level,
      timestamp: new Date().toISOString(),
      message: error.message,
      name: error.name,
      stack: error.stack,
      context,
      cause: error.cause,
    };

    switch (level) {
      case LOG_LEVELS.ERROR:
        console.error(JSON.stringify(logObject, null, 2));
        break;
      case LOG_LEVELS.WARN:
        console.warn(JSON.stringify(logObject, null, 2));
        break;
      case LOG_LEVELS.INFO:
        console.info(JSON.stringify(logObject, null, 2));
        break;
      case LOG_LEVELS.DEBUG:
        console.debug(JSON.stringify(logObject, null, 2));
        break;
      default:
        console.log(JSON.stringify(logObject, null, 2));
    }
  },
};

export const shouldShowErrorDetails = (): boolean =>
  process.env.NODE_ENV === 'development';
