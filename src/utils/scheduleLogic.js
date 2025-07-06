const CULTOS_DIAS_MAP = { 
  0: 'sunday', // Domingo
  2: 'tuesday', // Terça
  5: 'friday', // Sexta
};

const CULTOS_CONFIG = {
  sunday: [
    { id: 'RJM', label: 'RJM', needs: 1 },
    { id: 'MeiaHoraCulto', label: 'Meia Hora', needs: 1 },
    { id: 'Culto', label: 'Culto', needs: 1 },
  ],
  tuesday: [
    { id: 'MeiaHoraCulto', label: 'Meia Hora', needs: 1 },
    { id: 'Culto', label: 'Culto', needs: 1 },
  ],
  friday: [
    { id: 'MeiaHoraCulto', label: 'Meia Hora', needs: 1 },
    { id: 'Culto', label: 'Culto', needs: 1 },
  ],
};

/**
 * Formata um objeto Date para string DD/MM/YYYY.
 * @param {Date} dateObj - O objeto Date.
 * @returns {string} Data formatada.
 */
const formatDate = (dateObj) => {
  if (!(dateObj instanceof Date) || isNaN(dateObj)) return "Data inválida";
  const day = String(dateObj.getDate()).padStart(2, '0');
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const year = dateObj.getFullYear();
  return `${day}/${month}/${year}`;
};

/**
 * Obtém o nome do dia da semana em Português.
 * @param {Date} dateObj - O objeto Date.
 * @returns {string} Nome do dia da semana.
 */
const getDayName = (dateObj) => {
  if (!(dateObj instanceof Date) || isNaN(dateObj)) return "Dia inválido";
  const days = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
  return days[dateObj.getDay()];
};

/**
 * Gera a escala de organistas para um período.
 * @param {Array<object>} organists - Lista de organistas com suas disponibilidades.
 * @param {string} startDateStr - Data de início (YYYY-MM-DD).
 * @param {string} endDateStr - Data de término (YYYY-MM-DD).
 * @returns {Array<object>} A escala gerada.
 */

// Função "ajudante" criada fora da lógica principal para maior clareza e para resolver o aviso do linter.
const getAvailableOrganistsForSlot = (allOrganists, dayKey, culto, assignedForHalfHour) => {
  return allOrganists.filter(org => {
    // 1. Verifica se a organista está disponível naquele dia da semana.
    const isAvailableOnDay = org.availability[dayKey];
    if (!isAvailableOnDay) {
      return false;
    }

    // 2. Regra: Se o culto for o principal ('Culto') e alguém já foi escalado para a meia hora,
    //    não pode ser a mesma pessoa.
    if (culto.id === 'Culto' && assignedForHalfHour) {
      return org.id !== assignedForHalfHour.id;
    }

    // Se passou nas verificações, a organista está disponível para este slot.
    return true;
  });
};

export const generateSchedule = (organists, startDateStr, endDateStr) => {
  if (!organists || organists.length === 0) {
    // throw new Error("Nenhum organista cadastrado ou disponível para gerar a escala.");
    console.warn("Nenhum organista cadastrado para gerar escala.");
    return [];
  }

  // Validação básica das datas
  if (!startDateStr || !endDateStr || new Date(startDateStr) > new Date(endDateStr)) {
    console.error("Datas de início ou término inválidas.");
    return []; // Ou lançar erro
  }
  
  const startDate = new Date(startDateStr + "T00:00:00"); // Garante o início do dia local
  const endDate = new Date(endDateStr + "T23:59:59");   // Garante o fim do dia local

  let currentDate = new Date(startDate);
  const schedule = [];

  const organistUsage = organists.reduce((acc, org) => {
    acc[org.id] = { count: 0, lastAssignedDate: null };
    return acc;
  }, {});

  while (currentDate <= endDate) {
    const dayOfWeekJs = currentDate.getDay();
    const dayKey = CULTOS_DIAS_MAP[dayOfWeekJs];

    if (dayKey) {
      const dailyScheduleEntry = {
        date: formatDate(currentDate),
        dayName: getDayName(currentDate),
        assignments: {},
      };

      const cultosDoDia = CULTOS_CONFIG[dayKey];
      let organistaEscaladoParaMeiaHora = null;

      if (cultosDoDia) {
        for (const culto of cultosDoDia) {
          
          let availableOrganistsForSlot = getAvailableOrganistsForSlot(organists, dayKey, culto, organistaEscaladoParaMeiaHora);

          if (availableOrganistsForSlot.length > 0) {
            // Ordenar para priorizar...
            availableOrganistsForSlot.sort((a, b) => {
              const usageA = organistUsage[a.id].count;
              const usageB = organistUsage[b.id].count;
              if (usageA !== usageB) return usageA - usageB;

              const lastAssignedA = organistUsage[a.id].lastAssignedDate?.getTime() || 0;
              const lastAssignedB = organistUsage[b.id].lastAssignedDate?.getTime() || 0;
              return lastAssignedA - lastAssignedB;
            });
            
            const assignedOrganist = availableOrganistsForSlot[0];
            
            dailyScheduleEntry.assignments[culto.id] = assignedOrganist.name;
            organistUsage[assignedOrganist.id].count++;
            organistUsage[assignedOrganist.id].lastAssignedDate = new Date(currentDate.getTime());

            if (culto.id === 'MeiaHoraCulto') {
              organistaEscaladoParaMeiaHora = assignedOrganist;
            }
          } else {
            dailyScheduleEntry.assignments[culto.id] = 'VAGO';
          }
        }
      }
      schedule.push(dailyScheduleEntry);
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return schedule;
};