import {
  validateChurchName,
  validateOrganistName,
  validateChurchCode,
  validateDateRange,
  sanitizeString,
} from '../utils/validation';

describe('validation utils', () => {
  describe('validateChurchName', () => {
    test('rejeita nome vazio', () => {
      expect(validateChurchName('')).toEqual({
        isValid: false,
        error: 'Nome da igreja é obrigatório.',
      });
    });

    test('rejeita caracteres perigosos', () => {
      expect(validateChurchName('Igreja <script>')).toEqual({
        isValid: false,
        error: 'Nome contém caracteres inválidos.',
      });
    });

    test('aceita nome valido', () => {
      expect(validateChurchName('Congregacao Central')).toEqual({
        isValid: true,
      });
    });
  });

  describe('validateOrganistName', () => {
    test('exige pelo menos 2 caracteres', () => {
      expect(validateOrganistName('A')).toEqual({
        isValid: false,
        error: 'Nome deve ter pelo menos 2 caracteres.',
      });
    });

    test('aceita nome valido', () => {
      expect(validateOrganistName('Ana')).toEqual({
        isValid: true,
      });
    });
  });

  describe('validateChurchCode', () => {
    test('aceita codigo vazio', () => {
      expect(validateChurchCode('')).toEqual({ isValid: true });
    });

    test('rejeita padrao de codigo invalido', () => {
      expect(validateChurchCode('ABC 123')).toEqual({
        isValid: false,
        error: 'Código contém caracteres inválidos. Use apenas letras, números, hífen e underscore.',
      });
    });

    test('aceita codigo valido', () => {
      expect(validateChurchCode('ABC_123-TEST')).toEqual({ isValid: true });
    });
  });

  describe('validateDateRange', () => {
    test('rejeita datas ausentes', () => {
      expect(validateDateRange('', '')).toEqual({
        isValid: false,
        error: 'Defina as datas de início e fim.',
      });
    });

    test('rejeita ordem de datas invalida', () => {
      expect(validateDateRange('2026-03-10', '2026-03-01')).toEqual({
        isValid: false,
        error: 'Data de início deve ser anterior à data de fim.',
      });
    });

    test('rejeita periodos maiores que um ano', () => {
      expect(validateDateRange('2026-01-01', '2027-02-01')).toEqual({
        isValid: false,
        error: 'Período não pode exceder 1 ano.',
      });
    });

    test('aceita intervalo valido', () => {
      expect(validateDateRange('2026-01-01', '2026-03-31')).toEqual({
        isValid: true,
      });
    });
  });

  describe('sanitizeString', () => {
    test('remove caracteres perigosos e normaliza espacos', () => {
      expect(sanitizeString("  Ana   <b>'&  ")).toBe('Ana b');
    });
  });
});
