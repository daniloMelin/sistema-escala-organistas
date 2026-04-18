import { formatCompactRehearsalSummary, formatRehearsalSummary } from '../constants/rehearsal';

describe('rehearsal formatting', () => {
  test('retorna resumo formatado para semana valida', () => {
    expect(
      formatRehearsalSummary({
        weekOfMonth: 4,
        weekday: 'saturday',
        time: '17:30',
      })
    ).toBe('4 sábado do mês às 17:30');
  });

  test('retorna vazio para semana invalida', () => {
    expect(
      formatRehearsalSummary({
        weekOfMonth: 6,
        weekday: 'saturday',
        time: '17:30',
      })
    ).toBe('');

    expect(
      formatCompactRehearsalSummary({
        weekOfMonth: 'abc',
        weekday: 'tuesday',
        time: '19:30',
      })
    ).toBe('');
  });
});
