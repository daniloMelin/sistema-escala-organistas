export const REHEARSAL_WEEK_OPTIONS = [
  { value: '1', label: '1ª semana' },
  { value: '2', label: '2ª semana' },
  { value: '3', label: '3ª semana' },
  { value: '4', label: '4ª semana' },
  { value: '5', label: '5ª semana' },
];

export const REHEARSAL_WEEKDAY_OPTIONS = [
  { value: 'sunday', label: 'Domingo' },
  { value: 'monday', label: 'Segunda-feira' },
  { value: 'tuesday', label: 'Terça-feira' },
  { value: 'wednesday', label: 'Quarta-feira' },
  { value: 'thursday', label: 'Quinta-feira' },
  { value: 'friday', label: 'Sexta-feira' },
  { value: 'saturday', label: 'Sábado' },
];

export const REHEARSAL_HOUR_OPTIONS = Array.from({ length: 24 }, (_, hour) => {
  const value = String(hour).padStart(2, '0');
  return { value, label: value };
});

export const REHEARSAL_MINUTE_OPTIONS = Array.from({ length: 60 }, (_, minute) => {
  const value = String(minute).padStart(2, '0');
  return { value, label: value };
});

export const INITIAL_REHEARSAL = {
  weekOfMonth: '1',
  weekday: 'thursday',
  time: '',
  notes: '',
};

export const normalizeRehearsal = (rehearsal = {}) => ({
  weekOfMonth: rehearsal.weekOfMonth
    ? String(rehearsal.weekOfMonth)
    : INITIAL_REHEARSAL.weekOfMonth,
  weekday: rehearsal.weekday || INITIAL_REHEARSAL.weekday,
  time: rehearsal.time || '',
  notes: rehearsal.notes || '',
});

const getRehearsalWeekLabel = (weekOfMonth) =>
  REHEARSAL_WEEK_OPTIONS.find((option) => option.value === String(weekOfMonth))?.label || '';

const getRehearsalWeekdayLabel = (weekday) =>
  REHEARSAL_WEEKDAY_OPTIONS.find((option) => option.value === weekday)?.label.toLowerCase() || '';

export const formatRehearsalSummary = (rehearsal) => {
  if (!rehearsal) return '';

  const weekLabel = getRehearsalWeekLabel(rehearsal.weekOfMonth);
  const weekdayLabel = getRehearsalWeekdayLabel(rehearsal.weekday);

  if (!weekLabel || !weekdayLabel) return '';

  const baseSummary = `${weekLabel} ${weekdayLabel} do mês`;
  return rehearsal.time ? `${baseSummary} às ${rehearsal.time}` : baseSummary;
};
