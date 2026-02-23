import {
  validateChurchName,
  validateOrganistName,
  validateChurchCode,
  validateDateRange,
  sanitizeString,
} from '../utils/validation';

describe('validation utils', () => {
  describe('validateChurchName', () => {
    test('rejects empty name', () => {
      expect(validateChurchName('')).toEqual({
        isValid: false,
        error: 'Nome da igreja é obrigatório.',
      });
    });

    test('rejects dangerous characters', () => {
      expect(validateChurchName('Igreja <script>')).toEqual({
        isValid: false,
        error: 'Nome contém caracteres inválidos.',
      });
    });

    test('accepts valid name', () => {
      expect(validateChurchName('Congregacao Central')).toEqual({
        isValid: true,
      });
    });
  });

  describe('validateOrganistName', () => {
    test('requires at least 2 chars', () => {
      expect(validateOrganistName('A')).toEqual({
        isValid: false,
        error: 'Nome deve ter pelo menos 2 caracteres.',
      });
    });

    test('accepts valid name', () => {
      expect(validateOrganistName('Ana')).toEqual({
        isValid: true,
      });
    });
  });

  describe('validateChurchCode', () => {
    test('accepts empty code', () => {
      expect(validateChurchCode('')).toEqual({ isValid: true });
    });

    test('rejects invalid code pattern', () => {
      expect(validateChurchCode('ABC 123')).toEqual({
        isValid: false,
        error: 'Código contém caracteres inválidos. Use apenas letras, números, hífen e underscore.',
      });
    });

    test('accepts valid code', () => {
      expect(validateChurchCode('ABC_123-TEST')).toEqual({ isValid: true });
    });
  });

  describe('validateDateRange', () => {
    test('rejects missing dates', () => {
      expect(validateDateRange('', '')).toEqual({
        isValid: false,
        error: 'Defina as datas de início e fim.',
      });
    });

    test('rejects invalid order', () => {
      expect(validateDateRange('2026-03-10', '2026-03-01')).toEqual({
        isValid: false,
        error: 'Data de início deve ser anterior à data de fim.',
      });
    });

    test('rejects periods longer than one year', () => {
      expect(validateDateRange('2026-01-01', '2027-02-01')).toEqual({
        isValid: false,
        error: 'Período não pode exceder 1 ano.',
      });
    });

    test('accepts valid range', () => {
      expect(validateDateRange('2026-01-01', '2026-03-31')).toEqual({
        isValid: true,
      });
    });
  });

  describe('sanitizeString', () => {
    test('removes dangerous chars and normalizes spaces', () => {
      expect(sanitizeString("  Ana   <b>'&  ")).toBe('Ana b');
    });
  });
});
