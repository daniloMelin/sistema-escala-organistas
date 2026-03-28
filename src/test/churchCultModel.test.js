import {
  buildChurchConfig,
  DEFAULT_CULT_MODEL,
  getVisibleDaysFromConfig,
  inferCultModelFromConfig,
  inferSelectedDaysFromConfig,
} from '../utils/churchCultModel';
import { ALL_WEEK_DAYS, INITIAL_AVAILABILITY } from '../constants/days';

describe('churchCultModel', () => {
  test('monta config com culto e reserva para o modelo de culto unico', () => {
    const config = buildChurchConfig(
      { ...INITIAL_AVAILABILITY, sunday_rjm: true, sunday_culto: true, tuesday: true },
      'culto_unico_com_reserva'
    );

    expect(config.sunday.map((service) => service.id)).toEqual(['RJM', 'Culto', 'Reserva']);
    expect(config.tuesday.map((service) => service.id)).toEqual(['Culto', 'Reserva']);
  });

  test('identifica corretamente o modelo a partir da config existente', () => {
    expect(
      inferCultModelFromConfig({
        sunday: [{ id: 'Culto' }, { id: 'Reserva' }],
      })
    ).toBe('culto_unico_com_reserva');

    expect(
      inferCultModelFromConfig({
        tuesday: [{ id: 'MeiaHoraCulto' }, { id: 'Parte1' }, { id: 'Parte2' }],
      })
    ).toBe('meia_hora_parte1_parte2');

    expect(
      inferCultModelFromConfig({
        sunday: [{ id: 'MeiaHoraCulto' }, { id: 'Culto' }],
      })
    ).toBe(DEFAULT_CULT_MODEL);
  });

  test('reconstroi os dias selecionados a partir da config', () => {
    const selectedDays = inferSelectedDaysFromConfig({
      sunday: [{ id: 'RJM' }, { id: 'Culto' }, { id: 'Reserva' }],
      friday: [{ id: 'Culto' }, { id: 'Reserva' }],
    });

    expect(selectedDays).toEqual({
      ...INITIAL_AVAILABILITY,
      sunday_rjm: true,
      sunday_culto: true,
      friday: true,
    });
  });

  test('detecta dias visiveis quando domingo usa reserva ou partes', () => {
    const visibleDays = getVisibleDaysFromConfig(
      {
        sunday: [{ id: 'Culto' }, { id: 'Reserva' }],
        tuesday: [{ id: 'MeiaHoraCulto' }, { id: 'Parte1' }, { id: 'Parte2' }],
      },
      ALL_WEEK_DAYS
    );

    expect(visibleDays.map((day) => day.key)).toEqual(
      expect.arrayContaining(['sunday_culto', 'tuesday'])
    );
  });
});
