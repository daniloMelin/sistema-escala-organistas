const isDevelopment = process.env.NODE_ENV === 'development';

const emit = (level, message, meta) => {
  if (!isDevelopment) {
    // Hook para integração com serviços externos (Sentry, Datadog, etc.)
    return;
  }

  const logFn = console[level] || console.log;
  if (meta !== undefined) {
    logFn(message, meta);
    return;
  }

  logFn(message);
};

export const logger = {
  error: (message, meta) => emit('error', message, meta),
  warn: (message, meta) => emit('warn', message, meta),
  info: (message, meta) => emit('info', message, meta),
};

export default logger;
