const isDevelopment = process.env.NODE_ENV === 'development';

let reporter = null;
let contextProvider = null;

const emitToConsole = (level, message, meta) => {
  if (!isDevelopment) return;
  const logFn = console[level] || console.log;
  if (meta !== undefined) {
    logFn(message, meta);
    return;
  }
  logFn(message);
};

const emitToReporter = (entry) => {
  if (!reporter) return;
  Promise.resolve(reporter(entry)).catch((error) => {
    if (isDevelopment) {
      console.error('Falha ao enviar log para o reporter:', error);
    }
  });
};

const emit = (level, message, meta) => {
  const entry = {
    level,
    message: String(message),
    meta,
    timestamp: new Date().toISOString(),
    context: contextProvider ? contextProvider() : {},
  };

  emitToConsole(level, message, meta);
  emitToReporter(entry);
};

export const setLoggerReporter = (nextReporter) => {
  reporter = typeof nextReporter === 'function' ? nextReporter : null;
};

export const setLoggerContextProvider = (nextProvider) => {
  contextProvider = typeof nextProvider === 'function' ? nextProvider : null;
};

export const logger = {
  error: (message, meta) => emit('error', message, meta),
  warn: (message, meta) => emit('warn', message, meta),
  info: (message, meta) => emit('info', message, meta),
};

export default logger;
