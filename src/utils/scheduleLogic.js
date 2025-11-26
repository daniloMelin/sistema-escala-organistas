const DAY_KEY_MAP = { 
  0: 'sunday',    1: 'monday',    2: 'tuesday',   3: 'wednesday', 
  4: 'thursday',  5: 'friday',    6: 'saturday'
};

export const SERVICE_TEMPLATES = {
  RJM: { id: 'RJM', label: 'RJM', needs: 1 },
  MeiaHora: { id: 'MeiaHoraCulto', label: 'Meia Hora', needs: 1 },
  Culto: { id: 'Culto', label: 'Culto', needs: 1 },
};

const formatDate = (dateObj) => {
  if (!(dateObj instanceof Date) || isNaN(dateObj)) return "Data inválida";
  const day = String(dateObj.getDate()).padStart(2, '0');
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const year = dateObj.getFullYear();
  return `${day}/${month}/${year}`;
};

const getDayName = (dateObj) => {
  if (!(dateObj instanceof Date) || isNaN(dateObj)) return "Dia inválido";
  const days = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
  return days[dateObj.getDay()];
};

const getAvailableOrganistsForSlot = (allOrganists, dayKey, culto, assignedForHalfHour) => {
  return allOrganists.filter(org => {
    
    // --- CORREÇÃO AQUI ---
    let availabilityKey = dayKey;

    // Se for Domingo, precisamos decidir qual chave usar
    if (dayKey === 'sunday') {
        if (culto.id === 'RJM') {
            availabilityKey = 'sunday_rjm'; // Manhã
        } else {
            availabilityKey = 'sunday_culto'; // Noite (Meia Hora ou Culto)
        }
    }

    // Verifica se a organista tem esse horário marcado
    const isAvailable = org.availability && org.availability[availabilityKey];
    if (!isAvailable) return false;

    // Regra de não duplicidade: Se é Culto Oficial e ela já tocou na Meia Hora, não pode repetir
    if (culto.id === 'Culto' && assignedForHalfHour && assignedForHalfHour.id === org.id) {
      return false;
    }

    return true;
  });
};

export const generateSchedule = (organists, startDateStr, endDateStr, churchConfig) => {
  if (!organists || organists.length === 0) {
    console.warn("Nenhum organista cadastrado.");
    return [];
  }
  
  if (!churchConfig || Object.keys(churchConfig).length === 0) {
      console.warn("Configuração de cultos da igreja não encontrada.");
      return [];
  }

  const startDate = new Date(startDateStr + "T00:00:00");
  const endDate = new Date(endDateStr + "T23:59:59");
  
  let currentDate = new Date(startDate);
  const schedule = [];

  const organistUsage = organists.reduce((acc, org) => {
    acc[org.id] = { count: 0, lastAssignedDate: null };
    return acc;
  }, {});

  while (currentDate <= endDate) {
    const dayOfWeekJs = currentDate.getDay();
    const dayKey = DAY_KEY_MAP[dayOfWeekJs]; 

    const cultosDoDia = churchConfig[dayKey];

    if (cultosDoDia && cultosDoDia.length > 0) {
      const dailyScheduleEntry = {
        date: formatDate(currentDate),
        dayName: getDayName(currentDate),
        assignments: {},
      };

      let organistaEscaladoParaMeiaHora = null;

      for (const culto of cultosDoDia) {
        let availableOrganists = getAvailableOrganistsForSlot(organists, dayKey, culto, organistaEscaladoParaMeiaHora);

        if (availableOrganists.length > 0) {
          availableOrganists.sort((a, b) => {
            const usageA = organistUsage[a.id].count;
            const usageB = organistUsage[b.id].count;
            if (usageA !== usageB) return usageA - usageB;

            const lastAssignedA = organistUsage[a.id].lastAssignedDate?.getTime() || 0;
            const lastAssignedB = organistUsage[b.id].lastAssignedDate?.getTime() || 0;
            return lastAssignedA - lastAssignedB;
          });
          
          const assigned = availableOrganists[0];
          
          dailyScheduleEntry.assignments[culto.id] = assigned.name;
          organistUsage[assigned.id].count++;
          organistUsage[assigned.id].lastAssignedDate = new Date(currentDate.getTime());

          if (culto.id === 'MeiaHoraCulto') {
            organistaEscaladoParaMeiaHora = assigned;
          }
        } else {
          dailyScheduleEntry.assignments[culto.id] = 'VAGO';
        }
      }
      schedule.push(dailyScheduleEntry);
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return schedule;
};