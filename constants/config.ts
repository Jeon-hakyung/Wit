export const LOG_LEVELS = {
  ERROR: 'error',
  WARN: 'warn',
  INFO: 'info',
  DEBUG: 'debug',
} as const;

export const ENV_CONFIG = {
  development: {
    LOG_LEVEL: LOG_LEVELS.DEBUG,
    SHOW_STACK_TRACE: true,
  },
  production: {
    LOG_LEVEL: LOG_LEVELS.ERROR,
    SHOW_STACK_TRACE: false,
  },
  test: {
    LOG_LEVEL: LOG_LEVELS.WARN,
    SHOW_STACK_TRACE: true,
  },
} as const;

export const CONTENT_TYPES = {
  JSON: 'application/json',
  FORM_URLENCODED: 'application/x-www-form-urlencoded',
  TEXT_PLAIN: 'text/plain',
} as const;
