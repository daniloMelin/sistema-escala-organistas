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
    const dayKey = CULTOS_DIAS_MAP[dayOfWeekJs]; // Ex: 'sunday'

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
          // Filtrar organistas disponíveis para ESTE dia da semana
          let availableOrganistsForSlot = organists.filter(org =>
            org.availability[dayKey] &&
            // Regra: Não escalar o mesmo organista para Meia Hora e Culto no mesmo bloco de serviço
            (culto.id !== 'Culto' || !organistaEscaladoParaMeiaHora || org.id !== organistaEscaladoParaMeiaHora.id)
          );

          if (availableOrganistsForSlot.length > 0) {
            // Ordenar para priorizar: 1. Menor contagem, 2. Mais tempo desde a última escala
            availableOrganistsForSlot.sort((a, b) => {
              const usageA = organistUsage[a.id].count;
              const usageB = organistUsage[b.id].count;
              if (usageA !== usageB) return usageA - usageB;

              const lastAssignedA = organistUsage[a.id].lastAssignedDate?.getTime() || 0;
              const lastAssignedB = organistUsage[b.id].lastAssignedDate?.getTime() || 0;
              return lastAssignedA - lastAssignedB; // Quem tocou há mais tempo (menor timestamp) tem prioridade
            });
            
            const assignedOrganist = availableOrganistsForSlot[0]; // Pega o mais prioritário
            
            dailyScheduleEntry.assignments[culto.id] = assignedOrganist.name;
            organistUsage[assignedOrganist.id].count++;
            organistUsage[assignedOrganist.id].lastAssignedDate = new Date(currentDate.getTime()); // Copia a data

            if (culto.id === 'MeiaHoraCulto') {
              organistaEscaladoParaMeiaHora = assignedOrganist;
            }
          } else {
            dailyScheduleEntry.assignments[culto.id] = 'VAGO'; // Simplificado
          }
        }
      }
      schedule.push(dailyScheduleEntry);
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return schedule;
};