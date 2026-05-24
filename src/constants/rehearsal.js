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

export const REHEARSAL_TIME_OPTIONS = Array.from({ length: 65 }, (_, index) => {
  const totalMinutes = 6 * 60 + index * 15;
  const hour = String(Math.floor(totalMinutes / 60)).padStart(2, '0');
  const minute = String(totalMinutes % 60).padStart(2, '0');
  const value = `${hour}:${minute}`;

  return { value, label: value };
});
export const INITIAL_REHEARSAL = {
  weekOfMonth: '',
  weekday: '',
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

const isValidRehearsalWeek = (weekOfMonth) =>
  REHEARSAL_WEEK_OPTIONS.some((option) => option.value === String(weekOfMonth).trim());

const getRehearsalWeekdayLabel = (weekday) =>
  REHEARSAL_WEEKDAY_OPTIONS.find((option) => option.value === weekday)?.label.toLowerCase() || '';

export const formatRehearsalSummary = (rehearsal) => {
  if (!rehearsal) return '';

  const weekNumber = String(rehearsal.weekOfMonth || '').trim();
  const weekdayLabel = getRehearsalWeekdayLabel(rehearsal.weekday);

  if (!isValidRehearsalWeek(weekNumber) || !weekdayLabel) return '';

  const baseSummary = `${weekNumber} ${weekdayLabel} do mês`;
  return rehearsal.time ? `${baseSummary} às ${rehearsal.time}` : baseSummary;
};

export const formatCompactRehearsalSummary = (rehearsal) => {
  if (!rehearsal) return '';

  const weekNumber = String(rehearsal.weekOfMonth || '').trim();
  const weekdayLabel = getRehearsalWeekdayLabel(rehearsal.weekday);

  if (!isValidRehearsalWeek(weekNumber) || !weekdayLabel) return '';

  const baseSummary = `${weekNumber} ${weekdayLabel} do mês`;
  return rehearsal.time ? `${baseSummary} às ${rehearsal.time}` : baseSummary;
};
