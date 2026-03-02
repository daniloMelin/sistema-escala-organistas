import {
  getMonthYearLabel,
  isValidDate,
  formatDateForDisplay,
} from '../utils/dateUtils';

describe('dateUtils', () => {
  test('formata o rotulo de mes e ano a partir de DD/MM/YYYY', () => {
    expect(getMonthYearLabel('15/03/2026')).toBe('Março de 2026');
  });

  test('retorna a entrada original quando o mes e invalido', () => {
    expect(getMonthYearLabel('15/13/2026')).toBe('15/13/2026');
  });

  test('valida strings de data', () => {
    expect(isValidDate('2026-03-01')).toBe(true);
    expect(isValidDate('')).toBe(false);
    expect(isValidDate('invalid-date')).toBe(false);
  });

  test('formata YYYY-MM-DD para DD/MM/YYYY', () => {
    expect(formatDateForDisplay('2026-03-01')).toBe('01/03/2026');
    expect(formatDateForDisplay('invalid-date')).toBe('invalid-date');
    expect(formatDateForDisplay('')).toBe('');
  });
});
