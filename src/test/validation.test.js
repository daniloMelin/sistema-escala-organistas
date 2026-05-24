import {
  normalizeComparableString,
  validateOrganistAvailability,
  validateChurchName,
  validateOrganistName,
  validateChurchCode,
  validateChurchRehearsal,
  validateChurchRehearsalField,
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
        error: 'Use apenas letras e espaços no nome da igreja.',
      });
    });

    test('rejeita simbolos que caiam no range unicode antigo', () => {
      expect(validateChurchName('Igreja × Central')).toEqual({
        isValid: false,
        error: 'Use apenas letras e espaços no nome da igreja.',
      });
    });

    test('rejeita numeros no nome da igreja', () => {
      expect(validateChurchName('Igreja 2 Central')).toEqual({
        isValid: false,
        error: 'Use apenas letras e espaços no nome da igreja.',
      });
    });

    test('aceita nome valido', () => {
      expect(validateChurchName('Congregacao Central')).toEqual({
        isValid: true,
      });
    });

    test('aceita nome valido com acentuacao', () => {
      expect(validateChurchName('Congregação Central')).toEqual({
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

    test('rejeita simbolos especiais em nome de organista', () => {
      expect(validateOrganistName('Ana ÷')).toEqual({
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

  describe('validateOrganistAvailability', () => {
    test('rejeita quando nao ha dias visiveis configurados', () => {
      expect(validateOrganistAvailability({}, [])).toEqual({
        isValid: false,
        error:
          'Configure os dias de culto da igreja antes de cadastrar a disponibilidade da organista.',
      });
    });

    test('rejeita quando nenhum dia foi selecionado', () => {
      expect(
        validateOrganistAvailability({ monday: false, sunday_culto: false }, [
          { key: 'monday', label: 'Segunda' },
          { key: 'sunday_culto', label: 'Domingo (Culto)' },
        ])
      ).toEqual({
        isValid: false,
        error: 'Selecione pelo menos um dia de disponibilidade da organista.',
      });
    });

    test('aceita quando ao menos um dia visivel esta marcado', () => {
      expect(
        validateOrganistAvailability({ monday: true, sunday_culto: false }, [
          { key: 'monday', label: 'Segunda' },
          { key: 'sunday_culto', label: 'Domingo (Culto)' },
        ])
      ).toEqual({
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

  describe('validateChurchRehearsalField', () => {
    test('rejeita semana invalida', () => {
      expect(validateChurchRehearsalField('weekOfMonth', { weekOfMonth: '9' })).toEqual({
        isValid: false,
        error: 'Selecione a semana do mês do ensaio.',
      });
    });

    test('rejeita dia da semana invalido', () => {
      expect(validateChurchRehearsalField('weekday', { weekday: 'holiday' })).toEqual({
        isValid: false,
        error: 'Selecione o dia da semana do ensaio.',
      });
    });

    test('rejeita horario invalido', () => {
      expect(validateChurchRehearsalField('time', { time: '19h30' })).toEqual({
        isValid: false,
        error: 'Informe um horário válido no formato HH:MM.',
      });
    });

    test('rejeita observacao acima do limite', () => {
      expect(validateChurchRehearsalField('notes', { notes: 'a'.repeat(121) })).toEqual({
        isValid: false,
        error: 'A observação do ensaio pode ter no máximo 120 caracteres.',
      });
    });

    test('aceita campo desconhecido sem erro', () => {
      expect(validateChurchRehearsalField('unknown', {})).toEqual({
        isValid: true,
      });
    });
  });

  describe('normalizeComparableString', () => {
    test('normaliza espacos e caixa para comparacao', () => {
      expect(normalizeComparableString('  Ana   Júlia  ')).toBe('ana júlia');
    });
  });

  describe('sanitizeString', () => {
    test('remove caracteres perigosos e normaliza espacos', () => {
      expect(sanitizeString("  Ana   <b>'&  ")).toBe('Ana b');
    });
  });
});
