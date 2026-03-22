const E2E_STORAGE_KEYS = {
  session: 'organist_scheduler_e2e_session',
  database: 'organist_scheduler_e2e_db',
  failures: 'organist_scheduler_e2e_failures',
};

const E2E_TEST_USER = {
  uid: 'e2e-user',
  email: 'e2e@example.com',
};

const { gotoAuthScreen } = require('./navigation');

async function resetE2EState(page, database = { users: {} }, options = {}) {
  const failures = options.failures || {};
  await page.addInitScript(
    ({ keys, user, db, failures }) => {
      window.localStorage.setItem(keys.session, JSON.stringify(user));
      window.localStorage.setItem(keys.database, JSON.stringify(db));
      window.localStorage.setItem(keys.failures, JSON.stringify(failures || {}));
    },
    { keys: E2E_STORAGE_KEYS, user: E2E_TEST_USER, db: database, failures }
  );
}

async function clearE2EState(page) {
  await page.addInitScript(
    ({ keys }) => {
      window.localStorage.removeItem(keys.session);
      window.localStorage.removeItem(keys.database);
      window.localStorage.removeItem(keys.failures);
    },
    { keys: E2E_STORAGE_KEYS }
  );
}

async function loginAsE2EUser(page) {
  await gotoAuthScreen(page);
  await page.getByRole('button', { name: 'Entrar em modo E2E' }).click();
}

function buildChurchDatabase({
  churchId = 'church-seed-1',
  churchName = 'Igreja Seed',
  churchCode = 'SEED',
  includeSundayCulto = true,
  organists = [],
  schedules = [],
} = {}) {
  return buildChurchesDatabase([
    {
      id: churchId,
      name: churchName,
      code: churchCode,
      includeSundayCulto,
      organists,
      schedules,
    },
  ]);
}

function buildChurchesDatabase(churches = []) {
  const churchesMap = churches.reduce((acc, church, index) => {
    const id = church.id || `church-seed-${index + 1}`;
    const includeSundayCulto = church.includeSundayCulto !== false;
    const config = church.config || {
      sunday: includeSundayCulto
        ? [
            { id: 'MeiaHoraCulto', label: 'Meia Hora' },
            { id: 'Culto', label: 'Culto' },
          ]
        : [],
    };

    const organistsMap = (church.organists || []).reduce((orgAcc, organist, orgIndex) => {
      const orgId = organist.id || `organist-seed-${orgIndex + 1}`;
      orgAcc[orgId] = {
        id: orgId,
        name: organist.name,
        availability: organist.availability || {},
        createdAt: organist.createdAt || new Date('2026-03-02T00:00:00.000Z').toISOString(),
      };
      return orgAcc;
    }, {});

    const schedulesMap = (church.schedules || []).reduce((scheduleAcc, schedule, scheduleIndex) => {
      const scheduleId = schedule.id || `schedule-seed-${scheduleIndex + 1}`;
      scheduleAcc[scheduleId] = {
        id: scheduleId,
        generatedAt: schedule.generatedAt || new Date('2026-03-02T00:00:00.000Z').toISOString(),
        generatedMonth: schedule.generatedMonth || 3,
        generatedYear: schedule.generatedYear || 2026,
        assignments: schedule.assignments || [],
      };
      return scheduleAcc;
    }, {});

    acc[id] = {
      id,
      name: church.name || `Igreja Seed ${index + 1}`,
      code: church.code || `SEED${index + 1}`,
      config,
      createdAt: church.createdAt || new Date('2026-03-02T00:00:00.000Z').toISOString(),
      organists: organistsMap,
      schedules: schedulesMap,
    };

    return acc;
  }, {});

  return {
    users: {
      [E2E_TEST_USER.uid]: {
        profile: { email: E2E_TEST_USER.email },
        churches: churchesMap,
      },
    },
  };
}

module.exports = {
  buildChurchesDatabase,
  buildChurchDatabase,
  clearE2EState,
  loginAsE2EUser,
  resetE2EState,
};
