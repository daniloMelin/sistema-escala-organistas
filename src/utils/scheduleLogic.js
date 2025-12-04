import {
  parseISO,
  startOfDay,
  endOfDay,
  addDays,
  format,
  isValid,
  getDay as getDayFn,
} from "date-fns";

export const SERVICE_TEMPLATES = {
  RJM: { id: "RJM", label: "RJM", needs: 1 },
  MeiaHora: { id: "MeiaHoraCulto", label: "Meia Hora", needs: 1 },
  Culto: { id: "Culto", label: "Culto", needs: 1 },
};

// Mapa do dia da semana (getDay) para a chave de configuração da igreja
// getDay: 0 = Domingo, 1 = Segunda, 2 = Terça, ... 6 = Sábado
const DAY_INDEX_TO_CONFIG_KEY = {
  0: "sunday", // Domingo
  1: "monday", // Segunda
  2: "tuesday", // Terça
  3: "wednesday", // Quarta
  4: "thursday", // Quinta
  5: "friday", // Sexta
  6: "saturday", // Sábado
};

const formatDate = (dateObj) => {
  if (!dateObj || !isValid(dateObj)) return "Data inválida";
  return format(dateObj, "dd/MM/yyyy");
};

const getDayName = (dateObj) => {
  if (!dateObj || !isValid(dateObj)) return "Dia inválido";
  const days = [
    "Domingo",
    "Segunda",
    "Terça",
    "Quarta",
    "Quinta",
    "Sexta",
    "Sábado",
  ];
  return days[getDayFn(dateObj)];
};

// Mapeia qual chave de disponibilidade verificar para cada culto em cada dia
const getAvailabilityKey = (dayKey, cultoId) => {
  if (dayKey === "sunday") {
    return cultoId === "RJM" ? "sunday_rjm" : "sunday_culto";
  }
  // Para os outros dias, a chave é o nome do dia em inglês
  return dayKey;
};

const getAvailableOrganistsForSlot = (
  allOrganists,
  dayKey,
  culto,
  assignedForHalfHour
) => {
  const availabilityKey = getAvailabilityKey(dayKey, culto.id);

  return allOrganists.filter((org) => {
    const isAvailableOnDay =
      org.availability && org.availability[availabilityKey];
    if (!isAvailableOnDay) return false;
    if (culto.id === "Culto" && assignedForHalfHour) {
      return org.id !== assignedForHalfHour.id;
    }
    return true;
  });
};

export const generateSchedule = (
  organists,
  startDateStr,
  endDateStr,
  churchConfig = null
) => {
  if (!organists || organists.length === 0) {
    console.warn("Nenhum organista cadastrado para gerar escala.");
    return [];
  }

  if (!startDateStr || !endDateStr) {
    console.error("Datas de início ou término inválidas.");
    return [];
  }

  const parsedStart = parseISO(startDateStr);
  const parsedEnd = parseISO(endDateStr);
  if (!isValid(parsedStart) || !isValid(parsedEnd) || parsedStart > parsedEnd) {
    console.error("Datas de início ou término inválidas.");
    return [];
  }

  let currentDate = startOfDay(parsedStart);
  const endDate = endOfDay(parsedEnd);

  const schedule = [];

  const organistUsage = organists.reduce((acc, org) => {
    acc[org.id] = { count: 0, lastAssignedDate: null };
    return acc;
  }, {});

  while (currentDate <= endDate) {
    const dayOfWeekJs = getDayFn(currentDate);
    const dayKey = DAY_INDEX_TO_CONFIG_KEY[dayOfWeekJs];

    // Verifica se a igreja tem cultos configurados para este dia
    const cultosForThisDay =
      churchConfig && churchConfig[dayKey] ? churchConfig[dayKey] : [];

    if (cultosForThisDay.length > 0) {
      const dailyScheduleEntry = {
        date: formatDate(currentDate),
        dayName: getDayName(currentDate),
        assignments: {},
      };

      let organistaEscaladoParaMeiaHora = null;

      for (const culto of cultosForThisDay) {
        let availableOrganistsForSlot = getAvailableOrganistsForSlot(
          organists,
          dayKey,
          culto,
          organistaEscaladoParaMeiaHora
        );

        if (availableOrganistsForSlot.length > 0) {
          availableOrganistsForSlot.sort((a, b) => {
            const usageA = organistUsage[a.id].count;
            const usageB = organistUsage[b.id].count;
            if (usageA !== usageB) return usageA - usageB;

            const lastAssignedA = organistUsage[a.id].lastAssignedDate
              ? organistUsage[a.id].lastAssignedDate.getTime()
              : 0;
            const lastAssignedB = organistUsage[b.id].lastAssignedDate
              ? organistUsage[b.id].lastAssignedDate.getTime()
              : 0;
            return lastAssignedA - lastAssignedB;
          });

          const assignedOrganist = availableOrganistsForSlot[0];
          dailyScheduleEntry.assignments[culto.id] = assignedOrganist.name;
          organistUsage[assignedOrganist.id].count++;
          organistUsage[assignedOrganist.id].lastAssignedDate = new Date(
            currentDate.getTime()
          );

          if (culto.id === "MeiaHoraCulto") {
            organistaEscaladoParaMeiaHora = assignedOrganist;
          }
        } else {
          dailyScheduleEntry.assignments[culto.id] = "VAGO";
        }
      }
      schedule.push(dailyScheduleEntry);
    }
    currentDate = addDays(currentDate, 1);
  }

  return schedule;
};
