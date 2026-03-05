export const isE2EMode = process.env.REACT_APP_E2E_MODE === 'true';

export const E2E_STORAGE_KEYS = {
  session: 'organist_scheduler_e2e_session',
  database: 'organist_scheduler_e2e_db',
  failures: 'organist_scheduler_e2e_failures',
};

export const E2E_TEST_USER = {
  uid: 'e2e-user',
  email: 'e2e@example.com',
};

export const getE2ESession = () => {
  if (!isE2EMode || typeof window === 'undefined') return null;
  const rawSession = window.localStorage.getItem(E2E_STORAGE_KEYS.session);
  if (!rawSession) return null;

  try {
    return JSON.parse(rawSession);
  } catch {
    return null;
  }
};

export const setE2ESession = (user = E2E_TEST_USER) => {
  if (!isE2EMode || typeof window === 'undefined') return;
  window.localStorage.setItem(E2E_STORAGE_KEYS.session, JSON.stringify(user));
};

export const clearE2ESession = () => {
  if (!isE2EMode || typeof window === 'undefined') return;
  window.localStorage.removeItem(E2E_STORAGE_KEYS.session);
};
