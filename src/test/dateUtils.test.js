import {
  getMonthYearLabel,
  isValidDate,
  formatDateForDisplay,
} from '../utils/dateUtils';

describe('dateUtils', () => {
  test('formats month/year label from DD/MM/YYYY', () => {
    expect(getMonthYearLabel('15/03/2026')).toBe('Março de 2026');
  });

  test('returns input when month is invalid', () => {
    expect(getMonthYearLabel('15/13/2026')).toBe('15/13/2026');
  });

  test('validates date strings', () => {
    expect(isValidDate('2026-03-01')).toBe(true);
    expect(isValidDate('')).toBe(false);
    expect(isValidDate('invalid-date')).toBe(false);
  });

  test('formats YYYY-MM-DD to DD/MM/YYYY', () => {
    expect(formatDateForDisplay('2026-03-01')).toBe('01/03/2026');
    expect(formatDateForDisplay('invalid-date')).toBe('invalid-date');
    expect(formatDateForDisplay('')).toBe('');
  });
});
