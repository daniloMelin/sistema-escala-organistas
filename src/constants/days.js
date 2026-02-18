/**
 * Constantes para dias da semana e configurações relacionadas
 * Centraliza todas as definições de dias para evitar duplicação
 */

export const ALL_WEEK_DAYS = [
  { key: 'sunday_rjm', label: 'Domingo (RJM)' },
  { key: 'sunday_culto', label: 'Domingo (Culto)' },
  { key: 'monday', label: 'Segunda' },
  { key: 'tuesday', label: 'Terça' },
  { key: 'wednesday', label: 'Quarta' },
  { key: 'thursday', label: 'Quinta' },
  { key: 'friday', label: 'Sexta' },
  { key: 'saturday', label: 'Sábado' },
];

export const INITIAL_AVAILABILITY = {
  sunday_rjm: false,
  sunday_culto: false,
  monday: false,
  tuesday: false,
  wednesday: false,
  thursday: false,
  friday: false,
  saturday: false,
};

/**
 * Mapeia a chave do dia para o label formatado
 */
export const getDayLabel = (dayKey) => {
  const day = ALL_WEEK_DAYS.find(d => d.key === dayKey);
  return day ? day.label : dayKey;
};

/**
 * Formata disponibilidade para exibição
 */
export const formatAvailability = (availability) => {
  if (!availability) return "Sem disponibilidade";
  
  const activeDays = ALL_WEEK_DAYS.filter(day => {
    return availability[day.key] || (day.key === 'sunday_culto' && availability['sunday']);
  });

  if (activeDays.length === 0) return "Nenhum dia";

  return activeDays.map(d => {
    if (d.key === 'sunday_rjm') return 'Dom(RJM)';
    if (d.key === 'sunday_culto') return 'Dom(Culto)';
    return d.label.substring(0, 3);
  }).join(', ');
};

