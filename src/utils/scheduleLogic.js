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

/**
 * Verifica se uma organista pode tocar em um dia específico da semana
 * @param {Object} organist - Organista com fixedDays ou availability
 * @param {number} dayOfWeek - Dia da semana (0-6, onde 0=Domingo, 6=Sábado)
 * @param {string} dayKey - Chave do dia (sunday, monday, etc.)
 * @param {string} cultoId - ID do culto (RJM, MeiaHoraCulto, Culto)
 * @param {Object} churchConfig - Configuração da igreja
 * @returns {boolean} true se a organista pode tocar neste dia
 */
const canOrganistPlayOnDay = (organist, dayOfWeek, dayKey, cultoId, churchConfig) => {
  // Prioridade 1: Verifica fixedDays (nova estrutura)
  if (organist.fixedDays && Array.isArray(organist.fixedDays) && organist.fixedDays.length > 0) {
    // Se tem fixedDays, só pode tocar nesses dias
    if (!organist.fixedDays.includes(dayOfWeek)) {
      return false;
    }
  } else if (organist.availability) {
    // Prioridade 2: Compatibilidade com estrutura antiga (availability)
    const availabilityKey = getAvailabilityKey(dayKey, cultoId);
    if (!organist.availability[availabilityKey]) {
      return false;
    }
  }
  // Se não tem fixedDays nem availability, é livre (curinga) - pode tocar em qualquer dia

  // Verifica se a igreja tem este culto configurado para este dia
  const cultosForThisDay = churchConfig && churchConfig[dayKey] ? churchConfig[dayKey] : [];
  return cultosForThisDay.some(c => c.id === cultoId);
};

/**
 * PASSO A: Calcula o Availability Score para cada organista
 * Score baixo = organista restrita (ex: só sábados)
 * Score alto = organista livre (curinga)
 * 
 * @param {Array} organists - Lista de organistas
 * @param {Array} periodDates - Array de objetos representando os dias do período
 * @param {Object} churchConfig - Configuração da igreja
 * @returns {Object} Mapa de organistId -> availabilityScore
 */
const calculateAvailabilityScores = (organists, periodDates, churchConfig) => {
  const scores = {};

  organists.forEach(organist => {
    let score = 0;

    periodDates.forEach(dayInfo => {
      const { dayOfWeek, dayKey, cultos } = dayInfo;
      
      // Conta quantos cultos ela poderia tocar neste dia
      cultos.forEach(culto => {
        if (canOrganistPlayOnDay(organist, dayOfWeek, dayKey, culto.id, churchConfig)) {
          score++;
        }
      });
    });

    scores[organist.id] = score;
  });

  return scores;
};

/**
 * PASSO B: Ordena organistas por escassez (menor availabilityScore primeiro)
 * Organistas com poucos dias disponíveis são alocadas primeiro
 */
const sortOrganistsByScarcity = (organists, availabilityScores) => {
  return [...organists].sort((a, b) => {
    const scoreA = availabilityScores[a.id] || 0;
    const scoreB = availabilityScores[b.id] || 0;
    return scoreA - scoreB; // Crescente: menos disponíveis primeiro
  });
};

/**
 * PASSO C: Aloca organista em um dia específico, respeitando equilíbrio de funções
 * 
 * Regras:
 * - Uma organista NÃO pode tocar 2 vezes no mesmo dia
 * - Se ambos slots vazios: escolhe baseado em stats (equilíbrio)
 * - Se só um vazio: preenche o que sobrou
 * 
 * @param {Object} organist - Organista a ser alocada
 * @param {number} dayOfWeek - Dia da semana (0-6)
 * @param {string} dayKey - Chave do dia (sunday, monday, etc.)
 * @param {Array} cultos - Array de cultos configurados para este dia
 * @param {Object} organistStats - Estatísticas de alocação (será atualizado)
 * @param {Object} churchConfig - Configuração da igreja
 * @param {Object} currentDayAssignments - Atribuições já feitas neste dia
 * @returns {Object} { assignments: {}, assigned: boolean }
 */
const assignOrganistToDay = (
  organist,
  dayOfWeek,
  dayKey,
  cultos,
  organistStats,
  churchConfig,
  currentDayAssignments = {}
) => {
  const assignments = {};
  let assigned = false;

  // Filtra cultos que a organista pode tocar (respeitando fixedDays)
  const availableCultos = cultos.filter(culto => 
    canOrganistPlayOnDay(organist, dayOfWeek, dayKey, culto.id, churchConfig)
  );

  if (availableCultos.length === 0) {
    return { assignments, assigned: false };
  }

  // Verifica quais vagas já estão preenchidas neste dia
  const meiaHoraCulto = cultos.find(c => c.id === 'MeiaHoraCulto');
  const cultoCulto = cultos.find(c => c.id === 'Culto');
  const rjmCulto = cultos.find(c => c.id === 'RJM');
  
  const meiaHoraIsFree = meiaHoraCulto && !currentDayAssignments[meiaHoraCulto.id];
  const cultoIsFree = cultoCulto && !currentDayAssignments[cultoCulto.id];
  const rjmIsFree = rjmCulto && !currentDayAssignments[rjmCulto.id];

  // Verifica se a organista pode tocar em cada culto
  const canPlayRJM = availableCultos.some(c => c.id === 'RJM');
  const canPlayMeiaHora = availableCultos.some(c => c.id === 'MeiaHoraCulto');
  const canPlayCulto = availableCultos.some(c => c.id === 'Culto');

  // Inicializa stats se não existir (usa stats da organista ou cria novo)
  const stats = organistStats[organist.id] || 
    (organist.stats ? { ...organist.stats } : { meiaHora: 0, culto: 0, total: 0 });

  // REGRA DE DECISÃO DO CARGO
  // Prioridade 1: RJM (culto independente, verifica primeiro)
  if (rjmIsFree && canPlayRJM) {
    assignments[rjmCulto.id] = organist.name;
    organistStats[organist.id] = {
      meiaHora: stats.meiaHora,
      culto: stats.culto,
      total: stats.total + 1
    };
    assigned = true;
  }
  // Prioridade 2: Meia Hora e Culto (se ambos estão livres, decide por equilíbrio)
  else if (meiaHoraIsFree && cultoIsFree && canPlayMeiaHora && canPlayCulto) {
    // Ambas as vagas estão livres: decide baseado no equilíbrio de funções (stats)
    if (stats.meiaHora <= stats.culto) {
      // Aloca na Meia Hora (ela tocou mais Cultos até agora)
      assignments[meiaHoraCulto.id] = organist.name;
      organistStats[organist.id] = {
        meiaHora: stats.meiaHora + 1,
        culto: stats.culto,
        total: stats.total + 1
      };
      assigned = true;
    } else {
      // Aloca no Culto (ela tocou mais Meia Hora até agora)
      assignments[cultoCulto.id] = organist.name;
      organistStats[organist.id] = {
        meiaHora: stats.meiaHora,
        culto: stats.culto + 1,
        total: stats.total + 1
      };
      assigned = true;
    }
  }
  // Prioridade 3: Apenas um slot livre (complemento)
  else if (meiaHoraIsFree && canPlayMeiaHora) {
    // Apenas Meia Hora está livre (complemento)
    assignments[meiaHoraCulto.id] = organist.name;
    organistStats[organist.id] = {
      meiaHora: stats.meiaHora + 1,
      culto: stats.culto,
      total: stats.total + 1
    };
    assigned = true;
  } else if (cultoIsFree && canPlayCulto) {
    // Apenas Culto está livre (complemento)
    assignments[cultoCulto.id] = organist.name;
    organistStats[organist.id] = {
      meiaHora: stats.meiaHora,
      culto: stats.culto + 1,
      total: stats.total + 1
    };
    assigned = true;
  }

  return { assignments, assigned };
};

/**
 * Função principal: Gera escala inicial justa baseada em fixedDays
 * 
 * Algoritmo:
 * 1. Calcula availabilityScore (organistas restritas têm score baixo)
 * 2. Ordena por escassez (menos disponíveis primeiro)
 * 3. Aloca respeitando duplicidade e equilíbrio de funções
 * 4. Slots não preenchidos ficam como null/undefined (não "VAGO")
 * 
 * @param {Array} organists - Array de organistas { id, name, fixedDays, stats }
 * @param {string} startDateStr - Data inicial (ISO string)
 * @param {string} endDateStr - Data final (ISO string)
 * @param {Object} churchConfig - Configuração da igreja com dias de culto
 * @returns {Array} Array de objetos { date, dayName, assignments: { cultoId: organistName } }
 */
export const generateSchedule = (
  organists,
  startDateStr,
  endDateStr,
  churchConfig = null
) => {
  // Validações iniciais
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

  // Prepara periodDates: array de objetos representando cada dia do período
  let currentDate = startOfDay(parsedStart);
  const endDate = endOfDay(parsedEnd);
  const periodDates = [];

  while (currentDate <= endDate) {
    const dayOfWeek = getDayFn(currentDate); // 0 = Domingo, 6 = Sábado
    const dayKey = DAY_INDEX_TO_CONFIG_KEY[dayOfWeek];
    const cultosForThisDay = churchConfig && churchConfig[dayKey] ? churchConfig[dayKey] : [];

    if (cultosForThisDay.length > 0) {
      periodDates.push({
        date: new Date(currentDate),
        dateStr: formatDate(currentDate),
        dayName: getDayName(currentDate),
        dayOfWeek,
        dayKey,
        cultos: cultosForThisDay
      });
    }

    currentDate = addDays(currentDate, 1);
  }

  if (periodDates.length === 0) {
    console.warn("Nenhum dia de culto configurado no período.");
    return [];
  }

  // PASSO A: Calcula Availability Score para cada organista
  const availabilityScores = calculateAvailabilityScores(organists, periodDates, churchConfig);

  // PASSO B: Ordena organistas por escassez (crescente: menos disponíveis primeiro)
  const sortedOrganists = sortOrganistsByScarcity(organists, availabilityScores);

  // Inicializa estatísticas de alocação (será atualizado durante o processo)
  const organistStats = {};
  organists.forEach(org => {
    // Usa stats da organista se existir, senão inicializa com zeros
    organistStats[org.id] = org.stats ? { ...org.stats } : { meiaHora: 0, culto: 0, total: 0 };
  });

  // Rastreia datas já atribuídas para cada organista (evita duplicidade no mesmo dia)
  const assignedDates = {};
  organists.forEach(org => {
    assignedDates[org.id] = new Set();
  });

  // Inicializa o schedule (estrutura de retorno)
  const schedule = periodDates.map(dayInfo => ({
    date: dayInfo.dateStr,
    dayName: dayInfo.dayName,
    assignments: {}
  }));

  // PASSO C: Alocação e Equilíbrio (Loop Principal)
  // Itera sobre organistas ordenadas por escassez
  sortedOrganists.forEach(organist => {
    // Para cada organista, tenta encaixá-la nos dias que batem com sua disponibilidade
    periodDates.forEach((dayInfo, dayIndex) => {
      const { date, dayOfWeek, dayKey, cultos } = dayInfo;
      const dateStr = format(date, 'yyyy-MM-dd');

      // Regra de Duplicidade: uma organista NÃO pode tocar 2 vezes no mesmo dia
      if (assignedDates[organist.id].has(dateStr)) {
        return; // Já foi alocada neste dia, pula
      }

      // Verifica atribuições atuais do dia para saber quais slots estão livres
      const currentDayAssignments = schedule[dayIndex].assignments || {};

      // Tenta alocar a organista neste dia
      const { assignments, assigned } = assignOrganistToDay(
        organist,
        dayOfWeek,
        dayKey,
        cultos,
        organistStats,
        churchConfig,
        currentDayAssignments
      );

      if (assigned) {
        // Marca a data como usada para esta organista
        assignedDates[organist.id].add(dateStr);

        // Adiciona as atribuições ao schedule
        Object.keys(assignments).forEach(cultoId => {
          if (!schedule[dayIndex].assignments[cultoId]) {
            schedule[dayIndex].assignments[cultoId] = assignments[cultoId];
          }
        });
      }
    });
  });

  // PASSO D: Regra de Dobradinha (Double Duty) - Aplicar após alocação principal
  // Se Meia Hora ficou vazia e há alguém no Culto, a mesma pessoa faz ambos
  periodDates.forEach((dayInfo, dayIndex) => {
    const { dayOfWeek, dayKey, cultos } = dayInfo;
    const dayAssignments = schedule[dayIndex].assignments || {};
    
    // Verifica se há MeiaHoraCulto e Culto configurados para este dia
    const meiaHoraCulto = cultos.find(c => c.id === 'MeiaHoraCulto');
    const cultoCulto = cultos.find(c => c.id === 'Culto');
    
    if (!meiaHoraCulto || !cultoCulto) {
      return; // Não tem ambos os cultos, pula
    }
    
    const meiaHoraAssigned = dayAssignments[meiaHoraCulto.id];
    const cultoAssigned = dayAssignments[cultoCulto.id];
    
    // Se Meia Hora está vazia mas Culto está preenchido
    if (!meiaHoraAssigned && cultoAssigned) {
      // Encontra a organista que está escalada para o Culto
      const organistName = cultoAssigned;
      const organist = organists.find(org => org.name === organistName);
      
      if (organist) {
        // Verifica se a organista pode tocar Meia Hora neste dia
        const canPlayMeiaHora = canOrganistPlayOnDay(
          organist,
          dayOfWeek,
          dayKey,
          'MeiaHoraCulto',
          churchConfig
        );
        
        if (canPlayMeiaHora) {
          // Aplica a dobradinha: mesma organista faz Meia Hora também
          schedule[dayIndex].assignments[meiaHoraCulto.id] = organistName;
          
          // Atualiza estatísticas da organista
          const stats = organistStats[organist.id] || { meiaHora: 0, culto: 0, total: 0 };
          organistStats[organist.id] = {
            meiaHora: stats.meiaHora + 1,
            culto: stats.culto,
            total: stats.total + 1
          };
        }
      }
    }
  });

  // Tratamento de Falhas: slots não preenchidos ficam como null/undefined
  // (não preenche com "VAGO" - usuário preencherá manualmente depois)
  // Os slots já estão como undefined por padrão, então não precisamos fazer nada

  return schedule;
};
