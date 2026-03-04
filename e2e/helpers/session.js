const E2E_STORAGE_KEYS = {
  session: 'organist_scheduler_e2e_session',
  database: 'organist_scheduler_e2e_db',
  failures: 'organist_scheduler_e2e_failures',
};

const E2E_TEST_USER = {
  uid: 'e2e-user',
  email: 'e2e@example.com',
};

async function resetE2EState(page, database = { users: {} }, options = {}) {
  const failures = options.failures || {};
  await page.addInitScript(({ keys, user, db, failures }) => {
    window.localStorage.setItem(keys.session, JSON.stringify(user));
    window.localStorage.setItem(keys.database, JSON.stringify(db));
    window.localStorage.setItem(keys.failures, JSON.stringify(failures || {}));
  }, { keys: E2E_STORAGE_KEYS, user: E2E_TEST_USER, db: database, failures });
}

async function clearE2EState(page) {
  await page.addInitScript(({ keys }) => {
    window.localStorage.removeItem(keys.session);
    window.localStorage.removeItem(keys.database);
    window.localStorage.removeItem(keys.failures);
  }, { keys: E2E_STORAGE_KEYS });
}

async function loginAsE2EUser(page) {
  await page.goto('/');
  await page.getByRole('button', { name: 'Entrar em modo E2E' }).click();
}

function buildChurchDatabase({
  churchId = 'church-seed-1',
  churchName = 'Igreja Seed',
  churchCode = 'SEED',
  includeSundayCulto = true,
  organists = [],
} = {}) {
  const sundayConfig = [];

  if (includeSundayCulto) {
    sundayConfig.push(
      { id: 'MeiaHoraCulto', label: 'Meia Hora' },
      { id: 'Culto', label: 'Culto' }
    );
  }

  const organistsMap = organists.reduce((acc, organist, index) => {
    const id = organist.id || `organist-seed-${index + 1}`;
    acc[id] = {
      id,
      name: organist.name,
      availability: organist.availability || {},
      createdAt: new Date('2026-03-02T00:00:00.000Z').toISOString(),
    };
    return acc;
  }, {});

  return {
    users: {
      [E2E_TEST_USER.uid]: {
        profile: { email: E2E_TEST_USER.email },
        churches: {
          [churchId]: {
            id: churchId,
            name: churchName,
            code: churchCode,
            config: {
              sunday: sundayConfig,
            },
            createdAt: new Date('2026-03-02T00:00:00.000Z').toISOString(),
            organists: organistsMap,
            schedules: {},
          },
        },
      },
    },
  };
}

module.exports = {
  buildChurchDatabase,
  clearE2EState,
  loginAsE2EUser,
  resetE2EState,
};
