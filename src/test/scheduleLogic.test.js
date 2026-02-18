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

describe('generateSchedule', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('returns empty list when there are no organists', () => {
    const result = generateSchedule([], '2026-03-01', '2026-03-01', SUNDAY_CONFIG);
    expect(result).toEqual([]);
    expect(logger.warn).toHaveBeenCalledWith('Nenhum organista cadastrado para gerar escala.');
  });

  test('returns empty list when date range is invalid', () => {
    const result = generateSchedule(
      [{ id: '1', name: 'Ana', fixedDays: [0] }],
      '2026-03-10',
      '2026-03-01',
      SUNDAY_CONFIG
    );

    expect(result).toEqual([]);
    expect(logger.error).toHaveBeenCalledWith('Datas de início ou término inválidas.');
  });

  test('fills two sunday slots with different organists', () => {
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

  test('does not assign organist outside fixedDays', () => {
    const organists = [{ id: '1', name: 'Ana', fixedDays: [1] }]; // segunda

    const result = generateSchedule(organists, '2026-03-01', '2026-03-01', SUNDAY_CONFIG); // domingo
    expect(result).toHaveLength(1);
    expect(result[0].assignments).toEqual({});
  });

  test('applies double duty when Culto is assigned first', () => {
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
});
