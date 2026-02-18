import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebaseConfig';

const REPORTABLE_LEVELS = new Set(['error', 'warn']);
const DEDUP_WINDOW_MS = 30000;
const MAX_DEPTH = 4;
const MAX_STRING_LENGTH = 1000;

const recentSignatures = new Map();

const truncate = (value) => {
  if (typeof value !== 'string') return value;
  if (value.length <= MAX_STRING_LENGTH) return value;
  return `${value.slice(0, MAX_STRING_LENGTH)}...`;
};

const serializeValue = (value, depth = 0) => {
  if (value == null) return value;
  if (depth > MAX_DEPTH) return '[depth-limited]';

  if (value instanceof Error) {
    return {
      name: value.name,
      message: truncate(value.message),
      stack: truncate(value.stack || ''),
    };
  }

  const type = typeof value;
  if (type === 'string') return truncate(value);
  if (type === 'number' || type === 'boolean') return value;
  if (value instanceof Date) return value.toISOString();
  if (Array.isArray(value)) {
    return value.slice(0, 20).map((item) => serializeValue(item, depth + 1));
  }
  if (type === 'object') {
    const entries = Object.entries(value).slice(0, 30);
    return entries.reduce((acc, [key, nestedValue]) => {
      acc[key] = serializeValue(nestedValue, depth + 1);
      return acc;
    }, {});
  }

  return String(value);
};

const shouldSkipByDedup = (entry) => {
  const signature = `${entry.level}|${entry.message}|${entry.context?.route || ''}`;
  const now = Date.now();
  const lastTimestamp = recentSignatures.get(signature);

  if (lastTimestamp && now - lastTimestamp < DEDUP_WINDOW_MS) {
    return true;
  }

  recentSignatures.set(signature, now);

  // Limpeza simples para evitar crescimento infinito do mapa
  if (recentSignatures.size > 300) {
    recentSignatures.clear();
  }

  return false;
};

export const createFirestoreLoggerReporter = ({ getUser } = {}) => {
  return async (entry) => {
    if (process.env.NODE_ENV !== 'production') return;
    if (!REPORTABLE_LEVELS.has(entry.level)) return;
    if (shouldSkipByDedup(entry)) return;

    const user = getUser ? getUser() : null;
    if (!user?.uid) return;

    const payload = {
      level: entry.level,
      message: truncate(entry.message),
      meta: serializeValue(entry.meta),
      context: serializeValue(entry.context),
      clientTimestamp: entry.timestamp,
      createdAt: serverTimestamp(),
      route:
        typeof window !== 'undefined' && window.location
          ? window.location.pathname
          : null,
      userAgent:
        typeof navigator !== 'undefined' ? truncate(navigator.userAgent) : null,
    };

    await addDoc(collection(db, 'users', user.uid, 'appLogs'), payload);
  };
};

