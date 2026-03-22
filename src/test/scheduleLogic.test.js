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
    expect(result[0].assignments).toEqual({});
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
});
