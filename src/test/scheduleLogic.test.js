import logger from '../utils/logger';
import { generateSchedule, SERVICE_TEMPLATES } from '../utils/scheduleLogic';

jest.mock('../utils/logger', () => ({
  __esModule: true,
  default: {
    error: jest.fn(),
    warn: jest.fn(),
    info: jest.fn(),
  },
}));

const SUNDAY_CONFIG = {
  sunday: [SERVICE_TEMPLATES.MeiaHora, SERVICE_TEMPLATES.Culto],
};

const SUNDAY_WITH_RJM_CONFIG = {
  sunday: [SERVICE_TEMPLATES.RJM, SERVICE_TEMPLATES.MeiaHora, SERVICE_TEMPLATES.Culto],
};

const TUESDAY_CONFIG = {
  tuesday: [SERVICE_TEMPLATES.MeiaHora, SERVICE_TEMPLATES.Culto],
};

const FRIDAY_WITH_RESERVE_CONFIG = {
  friday: [SERVICE_TEMPLATES.Culto, SERVICE_TEMPLATES.Reserva],
};

const SUNDAY_WITH_RESERVE_CONFIG = {
  sunday: [SERVICE_TEMPLATES.Culto, SERVICE_TEMPLATES.Reserva],
};

const SUNDAY_WITH_THREE_SLOTS_CONFIG = {
  sunday: [SERVICE_TEMPLATES.MeiaHora, SERVICE_TEMPLATES.Parte1, SERVICE_TEMPLATES.Parte2],
};

const SUNDAY_AND_TUESDAY_WITH_THREE_SLOTS_CONFIG = {
  sunday: [SERVICE_TEMPLATES.MeiaHora, SERVICE_TEMPLATES.Parte1, SERVICE_TEMPLATES.Parte2],
  tuesday: [SERVICE_TEMPLATES.MeiaHora, SERVICE_TEMPLATES.Parte1, SERVICE_TEMPLATES.Parte2],
};

describe('generateSchedule', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('retorna lista vazia quando nao ha organistas', () => {
    const result = generateSchedule([], '2026-03-01', '2026-03-01', SUNDAY_CONFIG);
    expect(result).toEqual([]);
    expect(logger.warn).toHaveBeenCalledWith('Nenhum organista cadastrado para gerar escala.');
  });

  test('retorna lista vazia quando o intervalo de datas e invalido', () => {
    const result = generateSchedule(
      [{ id: '1', name: 'Ana', fixedDays: [0] }],
      '2026-03-10',
      '2026-03-01',
      SUNDAY_CONFIG
    );

    expect(result).toEqual([]);
    expect(logger.error).toHaveBeenCalledWith('Datas de início ou término inválidas.');
  });

  test('preenche dois slots de domingo com organistas diferentes', () => {
    const organists = [
      { id: '1', name: 'Ana', fixedDays: [0] },
      { id: '2', name: 'Bia', fixedDays: [0] },
    ];

    const result = generateSchedule(organists, '2026-03-01', '2026-03-01', SUNDAY_CONFIG);
    expect(result).toHaveLength(1);

    const assignments = result[0].assignments;
    expect(assignments.MeiaHoraCulto).toBeTruthy();
    expect(assignments.Culto).toBeTruthy();
    expect(assignments.MeiaHoraCulto).not.toBe(assignments.Culto);
  });

  test('nao escala organista fora dos fixedDays', () => {
    const organists = [{ id: '1', name: 'Ana', fixedDays: [1] }]; // segunda

    const result = generateSchedule(organists, '2026-03-01', '2026-03-01', SUNDAY_CONFIG); // domingo
    expect(result).toHaveLength(1);
    expect(result[0].assignments).toEqual({
      MeiaHoraCulto: undefined,
      Culto: undefined,
    });
  });

  test('mantem slots nao preenchidos no resultado para permitir edicao manual', () => {
    const organists = [{ id: '1', name: 'Ana', fixedDays: [0] }];

    const result = generateSchedule(
      organists,
      '2026-03-01',
      '2026-03-01',
      SUNDAY_WITH_THREE_SLOTS_CONFIG
    );

    expect(result).toHaveLength(1);
    expect(Object.keys(result[0].assignments)).toEqual(['MeiaHoraCulto', 'Parte1', 'Parte2']);
    expect(Object.values(result[0].assignments).filter(Boolean)).toHaveLength(1);
  });

  test('preenche culto e reserva como slots independentes no modelo com reserva', () => {
    const organists = [
      { id: '1', name: 'Ana', fixedDays: [0] },
      { id: '2', name: 'Bia', fixedDays: [0] },
    ];

    const result = generateSchedule(
      organists,
      '2026-03-01',
      '2026-03-01',
      SUNDAY_WITH_RESERVE_CONFIG
    );

    expect(result).toHaveLength(1);
    expect(result[0].assignments.Culto).toBeTruthy();
    expect(result[0].assignments.Reserva).toBeTruthy();
    expect(result[0].assignments.Culto).not.toBe(result[0].assignments.Reserva);
  });

  test('aloca culto e reserva como dupla valida e alterna as funcoes quando ha alternativa', () => {
    const organists = [
      {
        id: '1',
        name: 'Aline',
        fixedDays: [5],
        stats: { meiaHora: 0, culto: 0, total: 0 },
      },
      {
        id: '2',
        name: 'Cristiana',
        fixedDays: [5],
        stats: { meiaHora: 0, culto: 0, total: 0 },
      },
    ];

    const result = generateSchedule(
      organists,
      '2026-04-03',
      '2026-04-10',
      FRIDAY_WITH_RESERVE_CONFIG
    );

    expect(result).toHaveLength(2);
    expect(result[0].assignments.Culto).not.toBe(result[0].assignments.Reserva);
    expect(result[1].assignments.Culto).not.toBe(result[1].assignments.Reserva);
    expect(result[0].assignments.Culto).not.toBe(result[1].assignments.Culto);
    expect(result[0].assignments.Reserva).not.toBe(result[1].assignments.Reserva);
  });

  test('evita fixar a mesma organista no culto com reserva quando ha varias alternativas no mesmo dia', () => {
    const organists = [
      {
        id: '1',
        name: 'Aline',
        fixedDays: [5],
        stats: { meiaHora: 0, culto: 0, total: 0 },
      },
      {
        id: '2',
        name: 'Hosana',
        fixedDays: [0, 3, 5],
        stats: { meiaHora: 0, culto: 0, total: 0 },
      },
      {
        id: '3',
        name: 'Rosa',
        fixedDays: [0, 3, 5],
        stats: { meiaHora: 0, culto: 0, total: 0 },
      },
      {
        id: '4',
        name: 'Silva',
        fixedDays: [0, 3, 5],
        stats: { meiaHora: 0, culto: 0, total: 0 },
      },
    ];

    const result = generateSchedule(
      organists,
      '2026-04-03',
      '2026-04-24',
      FRIDAY_WITH_RESERVE_CONFIG
    );

    const fridayCultoAssignments = result.map((day) => day.assignments.Culto);
    expect(new Set(fridayCultoAssignments).size).toBeGreaterThan(1);
  });

  test('preenche os tres slots do modelo meia hora parte 1 e parte 2', () => {
    const organists = [
      { id: '1', name: 'Ana', fixedDays: [0] },
      { id: '2', name: 'Bia', fixedDays: [0] },
      { id: '3', name: 'Clara', fixedDays: [0] },
    ];

    const result = generateSchedule(
      organists,
      '2026-03-01',
      '2026-03-01',
      SUNDAY_WITH_THREE_SLOTS_CONFIG
    );

    expect(result).toHaveLength(1);
    expect(result[0].assignments.MeiaHoraCulto).toBeTruthy();
    expect(result[0].assignments.Parte1).toBeTruthy();
    expect(result[0].assignments.Parte2).toBeTruthy();

    const assignedNames = Object.values(result[0].assignments);
    expect(new Set(assignedNames).size).toBe(3);
  });

  test('evita fixar a mesma organista em Meia Hora no modelo com tres slots quando ha alternativas', () => {
    const organists = [
      { id: '1', name: 'Ana', fixedDays: [0], stats: { total: 0 } },
      { id: '2', name: 'Bia', fixedDays: [0], stats: { total: 0 } },
      { id: '3', name: 'Clara', fixedDays: [0], stats: { total: 0 } },
      { id: '4', name: 'Dani', fixedDays: [0], stats: { total: 0 } },
      { id: '5', name: 'Eva', fixedDays: [0], stats: { total: 0 } },
    ];

    const result = generateSchedule(
      organists,
      '2026-03-01',
      '2026-03-22',
      SUNDAY_WITH_THREE_SLOTS_CONFIG
    );

    const meiaHoraAssignments = result.map((day) => day.assignments.MeiaHoraCulto);
    expect(new Set(meiaHoraAssignments).size).toBeGreaterThan(1);
  });

  test('distribui melhor a carga total no modelo com tres slots em dias recorrentes', () => {
    const organists = [
      { id: '1', name: 'Ana', fixedDays: [0], stats: { total: 0 } },
      { id: '2', name: 'Bia', fixedDays: [0], stats: { total: 0 } },
      { id: '3', name: 'Clara', fixedDays: [0], stats: { total: 0 } },
      { id: '4', name: 'Dani', fixedDays: [0], stats: { total: 0 } },
      { id: '5', name: 'Eva', fixedDays: [0], stats: { total: 0 } },
    ];

    const result = generateSchedule(
      organists,
      '2026-03-01',
      '2026-03-29',
      SUNDAY_WITH_THREE_SLOTS_CONFIG
    );

    const totals = {};
    result.forEach((day) => {
      Object.values(day.assignments).forEach((name) => {
        totals[name] = (totals[name] || 0) + 1;
      });
    });

    const values = Object.values(totals);
    expect(Object.keys(totals)).toHaveLength(5);
    expect(Math.max(...values) - Math.min(...values)).toBeLessThanOrEqual(1);
  });

  test('preserva organista mais escassa fora do trio quando ha equipe mais flexivel suficiente', () => {
    const organists = [
      { id: '1', name: 'Ana', fixedDays: [0], stats: { total: 0 } },
      { id: '2', name: 'Bia', fixedDays: [0, 2], stats: { total: 0 } },
      { id: '3', name: 'Clara', fixedDays: [0, 2], stats: { total: 0 } },
      { id: '4', name: 'Dani', fixedDays: [0, 2], stats: { total: 0 } },
    ];

    const result = generateSchedule(
      organists,
      '2026-03-01',
      '2026-03-03',
      SUNDAY_AND_TUESDAY_WITH_THREE_SLOTS_CONFIG
    );

    expect(result).toHaveLength(2);
    expect(Object.values(result[0].assignments)).not.toContain('Ana');
    expect(Object.values(result[0].assignments)).toEqual(
      expect.arrayContaining(['Bia', 'Clara', 'Dani'])
    );
  });

  test('aplica atribuicao dupla quando Culto e definido primeiro', () => {
    const organists = [
      {
        id: '1',
        name: 'Ana',
        fixedDays: [0],
        stats: { meiaHora: 3, culto: 0, total: 3 },
      },
    ];

    const result = generateSchedule(organists, '2026-03-01', '2026-03-01', SUNDAY_CONFIG);
    expect(result).toHaveLength(1);

    const assignments = result[0].assignments;
    expect(assignments.Culto).toBe('Ana');
    expect(assignments.MeiaHoraCulto).toBe('Ana');
  });

  test('distribui atribuicoes de forma equilibrada entre organistas com a mesma disponibilidade', () => {
    const organists = [
      { id: '1', name: 'Ana', fixedDays: [2] },
      { id: '2', name: 'Bia', fixedDays: [2] },
      { id: '3', name: 'Clara', fixedDays: [2] },
      { id: '4', name: 'Dani', fixedDays: [2] },
    ];

    const result = generateSchedule(organists, '2026-03-03', '2026-03-24', TUESDAY_CONFIG);
    const totals = {};

    result.forEach((day) => {
      Object.values(day.assignments).forEach((name) => {
        totals[name] = (totals[name] || 0) + 1;
      });
    });

    const values = Object.values(totals);
    expect(Object.keys(totals)).toHaveLength(4);
    expect(Math.max(...values) - Math.min(...values)).toBeLessThanOrEqual(1);
  });

  test('prioriza menor carga total antes de zerar contagem por funcao quando ha alternativa viavel', () => {
    const organists = [
      {
        id: '1',
        name: 'Ana',
        fixedDays: [2],
        stats: { meiaHora: 0, culto: 4, total: 4 },
      },
      {
        id: '2',
        name: 'Bia',
        fixedDays: [2],
        stats: { meiaHora: 1, culto: 0, total: 1 },
      },
    ];

    const result = generateSchedule(organists, '2026-03-03', '2026-03-03', TUESDAY_CONFIG);

    expect(result).toHaveLength(1);
    expect(result[0].assignments.MeiaHoraCulto).toBe('Bia');
    expect(result[0].assignments.Culto).toBe('Ana');
  });

  test('prioriza organista escassa para RJM para preservar atribuicoes viaveis no domingo', () => {
    const organists = [
      {
        id: '1',
        name: 'RjmOnly',
        availability: { sunday_rjm: true, sunday_culto: false },
        stats: { meiaHora: 0, culto: 0, total: 5 },
      },
      {
        id: '2',
        name: 'Flexible',
        availability: { sunday_rjm: true, sunday_culto: true },
        stats: { meiaHora: 0, culto: 0, total: 0 },
      },
    ];

    const result = generateSchedule(organists, '2026-03-01', '2026-03-01', SUNDAY_WITH_RJM_CONFIG);
    expect(result).toHaveLength(1);

    const assignments = result[0].assignments;
    expect(assignments.RJM).toBe('RjmOnly');
    expect(assignments.MeiaHoraCulto).toBe('Flexible');
    expect(assignments.Culto).toBe('Flexible');
  });

  test('prioriza a dupla de menor carga total em culto e reserva quando ha alternativas viaveis', () => {
    const organists = [
      {
        id: '1',
        name: 'Aline',
        fixedDays: [5],
        stats: { culto: 0, reserva: 4, total: 4 },
      },
      {
        id: '2',
        name: 'Bela',
        fixedDays: [5],
        stats: { culto: 1, reserva: 0, total: 1 },
      },
      {
        id: '3',
        name: 'Cris',
        fixedDays: [5],
        stats: { culto: 4, reserva: 0, total: 4 },
      },
      {
        id: '4',
        name: 'Dora',
        fixedDays: [5],
        stats: { culto: 0, reserva: 1, total: 1 },
      },
    ];

    const result = generateSchedule(
      organists,
      '2026-04-03',
      '2026-04-03',
      FRIDAY_WITH_RESERVE_CONFIG
    );

    expect(result).toHaveLength(1);
    expect(new Set([result[0].assignments.Culto, result[0].assignments.Reserva])).toEqual(
      new Set(['Bela', 'Dora'])
    );
  });

  test('evita repetir a mesma funcao em domingos consecutivos quando ha alternativa viavel', () => {
    const organists = [
      {
        id: '1',
        name: 'Vera',
        fixedDays: [0],
        stats: { meiaHora: 0, culto: 0, total: 0 },
      },
      {
        id: '2',
        name: 'Jaki',
        fixedDays: [0],
        stats: { meiaHora: 0, culto: 2, total: 2 },
      },
      {
        id: '3',
        name: 'Thais',
        fixedDays: [0],
        stats: { meiaHora: 2, culto: 0, total: 2 },
      },
    ];

    const result = generateSchedule(organists, '2026-03-01', '2026-03-08', SUNDAY_CONFIG);

    expect(result).toHaveLength(2);
    expect(result[0].assignments.MeiaHoraCulto).toBe('Vera');
    expect(result[1].assignments.MeiaHoraCulto).not.toBe('Vera');
    expect(result[1].assignments.Culto).toBe('Vera');
  });
});
