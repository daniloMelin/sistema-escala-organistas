import { E2E_STORAGE_KEYS } from '../utils/e2eMode';

const createEmptyDatabase = () => ({
  users: {},
});

const getStorage = () => {
  if (typeof window === 'undefined') {
    throw new Error('Modo E2E requer window.localStorage.');
  }

  const rawDatabase = window.localStorage.getItem(E2E_STORAGE_KEYS.database);
  if (!rawDatabase) return createEmptyDatabase();

  try {
    const parsedDatabase = JSON.parse(rawDatabase);
    return parsedDatabase?.users ? parsedDatabase : createEmptyDatabase();
  } catch {
    return createEmptyDatabase();
  }
};

const persistStorage = (database) => {
  window.localStorage.setItem(E2E_STORAGE_KEYS.database, JSON.stringify(database));
};

const getFailureStorage = () => {
  const rawFailures = window.localStorage.getItem(E2E_STORAGE_KEYS.failures);
  if (!rawFailures) return {};

  try {
    const parsedFailures = JSON.parse(rawFailures);
    return parsedFailures && typeof parsedFailures === 'object' ? parsedFailures : {};
  } catch {
    return {};
  }
};

const persistFailureStorage = (failureStorage) => {
  window.localStorage.setItem(E2E_STORAGE_KEYS.failures, JSON.stringify(failureStorage));
};

const shouldFailOperation = (operationName) => {
  const failureStorage = getFailureStorage();
  const operationFailure = failureStorage[operationName];

  if (!operationFailure) return false;

  if (operationFailure === true || operationFailure === 'always') return true;

  if (operationFailure === 'once') {
    delete failureStorage[operationName];
    persistFailureStorage(failureStorage);
    return true;
  }

  if (typeof operationFailure === 'number' && operationFailure > 0) {
    failureStorage[operationName] = operationFailure - 1;
    if (failureStorage[operationName] <= 0) delete failureStorage[operationName];
    persistFailureStorage(failureStorage);
    return true;
  }

  return false;
};

const throwIfOperationConfiguredToFail = (operationName, message) => {
  if (shouldFailOperation(operationName)) {
    throw new Error(message);
  }
};

const ensureUser = (database, userId) => {
  if (!database.users[userId]) {
    database.users[userId] = {
      profile: { email: 'e2e@example.com' },
      churches: {},
    };
  }

  return database.users[userId];
};

const ensureChurch = (database, userId, churchId) => {
  const userData = ensureUser(database, userId);
  const church = userData.churches[churchId];
  if (!church) throw new Error('Igreja não encontrada no modo E2E.');
  return church;
};

const createId = (prefix) => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const sortByName = (items) => [...items].sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));

export const addChurchLocal = async (userId, churchData) => {
  throwIfOperationConfiguredToFail('addChurchLocal', 'Falha E2E simulada ao adicionar igreja.');
  const database = getStorage();
  const userData = ensureUser(database, userId);
  const id = createId('church');

  userData.churches[id] = {
    id,
    ...churchData,
    createdAt: new Date().toISOString(),
    organists: {},
    schedules: {},
  };

  persistStorage(database);
  return { id, ...churchData };
};

export const getChurchesLocal = async (userId) => {
  throwIfOperationConfiguredToFail('getChurchesLocal', 'Falha E2E simulada ao carregar igrejas.');
  const database = getStorage();
  const userData = ensureUser(database, userId);
  return sortByName(
    Object.values(userData.churches).map(({ organists, schedules, ...church }) => church)
  );
};

export const updateChurchLocal = async (userId, churchId, dataToUpdate) => {
  throwIfOperationConfiguredToFail('updateChurchLocal', 'Falha E2E simulada ao atualizar igreja.');
  const database = getStorage();
  const church = ensureChurch(database, userId, churchId);
  Object.assign(church, dataToUpdate);
  persistStorage(database);
};

export const getChurchLocal = async (userId, churchId) => {
  throwIfOperationConfiguredToFail('getChurchLocal', 'Falha E2E simulada ao carregar igreja.');
  const database = getStorage();
  const church = ensureChurch(database, userId, churchId);
  const { organists, schedules, ...churchData } = church;
  return churchData;
};

export const deleteChurchLocal = async (userId, churchId) => {
  throwIfOperationConfiguredToFail('deleteChurchLocal', 'Falha E2E simulada ao excluir igreja.');
  const database = getStorage();
  const userData = ensureUser(database, userId);
  delete userData.churches[churchId];
  persistStorage(database);
};

export const addOrganistLocal = async (userId, churchId, organistData) => {
  throwIfOperationConfiguredToFail(
    'addOrganistLocal',
    'Falha E2E simulada ao adicionar organista.'
  );
  const database = getStorage();
  const church = ensureChurch(database, userId, churchId);
  const id = createId('organist');

  church.organists[id] = {
    id,
    ...organistData,
    createdAt: new Date().toISOString(),
  };

  persistStorage(database);
  return { id, ...organistData };
};

export const getOrganistsLocal = async (userId, churchId) => {
  throwIfOperationConfiguredToFail(
    'getOrganistsLocal',
    'Falha E2E simulada ao carregar organistas.'
  );
  const database = getStorage();
  const church = ensureChurch(database, userId, churchId);
  return sortByName(Object.values(church.organists));
};

export const updateOrganistLocal = async (userId, churchId, organistId, dataToUpdate) => {
  throwIfOperationConfiguredToFail(
    'updateOrganistLocal',
    'Falha E2E simulada ao atualizar organista.'
  );
  const database = getStorage();
  const church = ensureChurch(database, userId, churchId);
  if (!church.organists[organistId]) throw new Error('Organista não encontrada no modo E2E.');
  Object.assign(church.organists[organistId], dataToUpdate);
  persistStorage(database);
};

export const deleteOrganistLocal = async (userId, churchId, organistId) => {
  throwIfOperationConfiguredToFail(
    'deleteOrganistLocal',
    'Falha E2E simulada ao excluir organista.'
  );
  const database = getStorage();
  const church = ensureChurch(database, userId, churchId);
  delete church.organists[organistId];
  persistStorage(database);
};

export const saveScheduleLocal = async (userId, churchId, scheduleId, scheduleData) => {
  throwIfOperationConfiguredToFail('saveScheduleLocal', 'Falha E2E simulada ao salvar escala.');
  const database = getStorage();
  const church = ensureChurch(database, userId, churchId);
  church.schedules[scheduleId] = {
    id: scheduleId,
    ...scheduleData,
    generatedAt: scheduleData.generatedAt || new Date().toISOString(),
  };
  persistStorage(database);
};

export const getSchedulesLocal = async (userId, churchId, count = 3) => {
  throwIfOperationConfiguredToFail('getSchedulesLocal', 'Falha E2E simulada ao carregar escalas.');
  const database = getStorage();
  const church = ensureChurch(database, userId, churchId);
  return Object.values(church.schedules)
    .sort((a, b) => new Date(b.generatedAt).getTime() - new Date(a.generatedAt).getTime())
    .slice(0, count);
};

export const getScheduleCountLocal = async (userId, churchId) => {
  throwIfOperationConfiguredToFail(
    'getScheduleCountLocal',
    'Falha E2E simulada ao contar escalas.'
  );
  const database = getStorage();
  const church = ensureChurch(database, userId, churchId);
  return Object.keys(church.schedules).length;
};
