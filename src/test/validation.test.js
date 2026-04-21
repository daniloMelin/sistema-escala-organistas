import {
  validateChurchName,
  validateOrganistName,
  validateChurchCode,
  validateChurchRehearsal,
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

    test('rejeita caracteres invalidos fora da regra do negocio', () => {
      expect(validateChurchName('Igreja <script>')).toEqual({
        isValid: false,
        error: 'Use apenas letras, números e espaços no nome da igreja.',
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

    test('rejeita numeros no nome da organista', () => {
      expect(validateOrganistName('Ana 1')).toEqual({
        isValid: false,
        error: 'Use apenas letras e espaços no nome da organista.',
      });
    });

    test('rejeita mais de duas palavras', () => {
      expect(validateOrganistName('Ana Maria Silva')).toEqual({
        isValid: false,
        error: 'Informe somente o primeiro nome ou nome e sobrenome.',
      });
    });

    test('rejeita nome com mais de 40 caracteres', () => {
      expect(validateOrganistName('AnastaciaBernardinaConceicao AlexandrinaMaria')).toEqual({
        isValid: false,
        error: 'Nome deve ter no máximo 40 caracteres.',
      });
    });

    test('aceita nome valido', () => {
      expect(validateOrganistName('Ana')).toEqual({
        isValid: true,
      });
    });

    test('aceita nome e sobrenome com acentuacao', () => {
      expect(validateOrganistName('Ana Júlia')).toEqual({
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
        error:
          'Código contém caracteres inválidos. Use apenas letras, números, hífen e underscore.',
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

    test('rejeita periodo que entra no quarto mes mesmo por um dia', () => {
      expect(validateDateRange('2026-04-01', '2026-07-01')).toEqual({
        isValid: false,
        error:
          'A escala deve ficar dentro de até 3 meses. Ajuste a data final para não entrar no 4º mês.',
      });
    });
  });

  describe('validateChurchRehearsal', () => {
    test('rejeita ensaio ausente', () => {
      expect(validateChurchRehearsal()).toEqual({
        isValid: false,
        error: 'Preencha os dados do ensaio local.',
      });
    });

    test('rejeita horario invalido', () => {
      expect(
        validateChurchRehearsal({
          weekOfMonth: '1',
          weekday: 'thursday',
          time: '19h30',
          notes: '',
        })
      ).toEqual({
        isValid: false,
        error: 'Informe um horário válido no formato HH:MM.',
      });
    });

    test('rejeita observacao acima do limite', () => {
      expect(
        validateChurchRehearsal({
          weekOfMonth: '1',
          weekday: 'thursday',
          time: '19:30',
          notes: 'a'.repeat(121),
        })
      ).toEqual({
        isValid: false,
        error: 'A observação do ensaio pode ter no máximo 120 caracteres.',
      });
    });

    test('aceita ensaio completo valido', () => {
      expect(
        validateChurchRehearsal({
          weekOfMonth: '1',
          weekday: 'thursday',
          time: '19:30',
          notes: 'Culto começa às 19:00.',
        })
      ).toEqual({
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
