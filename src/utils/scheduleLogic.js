import {
  parseISO,
  startOfDay,
  endOfDay,
  addDays,
  format,
  isValid,
  getDay as getDayFn,
} from 'date-fns';
import logger from './logger';

export const SERVICE_TEMPLATES = {
  RJM: { id: 'RJM', label: 'RJM', needs: 1 },
  MeiaHora: { id: 'MeiaHoraCulto', label: 'Meia Hora', needs: 1 },
  Culto: { id: 'Culto', label: 'Culto', needs: 1 },
  Reserva: { id: 'Reserva', label: 'Reserva', needs: 1 },
  Parte1: { id: 'Parte1', label: 'Parte 1', needs: 1 },
  Parte2: { id: 'Parte2', label: 'Parte 2', needs: 1 },
};

// Mapa do dia da semana (getDay) para a chave de configuração da igreja
// getDay: 0 = Domingo, 1 = Segunda, 2 = Terça, ... 6 = Sábado
const DAY_INDEX_TO_CONFIG_KEY = {
  0: 'sunday', // Domingo
  1: 'monday', // Segunda
  2: 'tuesday', // Terça
  3: 'wednesday', // Quarta
  4: 'thursday', // Quinta
  5: 'friday', // Sexta
  6: 'saturday', // Sábado
};

const formatDate = (dateObj) => {
  if (!dateObj || !isValid(dateObj)) return 'Data inválida';
  return format(dateObj, 'dd/MM/yyyy');
};

const getDayName = (dateObj) => {
  if (!dateObj || !isValid(dateObj)) return 'Dia inválido';
  const days = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
  return days[getDayFn(dateObj)];
};

// Mapeia qual chave de disponibilidade verificar para cada culto em cada dia
const getAvailabilityKey = (dayKey, cultoId) => {
  if (dayKey === 'sunday') {
    return cultoId === 'RJM' ? 'sunday_rjm' : 'sunday_culto';
  }
  // Para os outros dias, a chave é o nome do dia em inglês
  return dayKey;
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
  return cultosForThisDay.some((c) => c.id === cultoId);
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

  organists.forEach((organist) => {
    let score = 0;

    periodDates.forEach((dayInfo) => {
      const { dayOfWeek, dayKey, cultos } = dayInfo;

      // Conta quantos cultos ela poderia tocar neste dia
      cultos.forEach((culto) => {
        if (canOrganistPlayOnDay(organist, dayOfWeek, dayKey, culto.id, churchConfig)) {
          score++;
        }
      });
    });

    scores[organist.id] = score;
  });

  return scores;
};

const SERVICE_PRIORITY = {
  RJM: 0,
  MeiaHoraCulto: 1,
  Culto: 2,
  Parte1: 2,
  Parte2: 3,
  Reserva: 4,
};

export const getServiceDisplayLabel = (serviceId) => {
  const labels = {
    RJM: 'RJM',
    MeiaHoraCulto: 'Meia Hora',
    Culto: 'Culto',
    Parte1: 'Parte 1',
    Parte2: 'Parte 2',
    Reserva: 'Reserva',
  };

  return labels[serviceId] || serviceId;
};

export const getServiceSortPriority = (serviceId) => SERVICE_PRIORITY[serviceId] ?? 99;

const getRoleCountForCulto = (stats, cultoId) => {
  if (cultoId === 'MeiaHoraCulto') return stats.meiaHora || 0;
  if (cultoId === 'Culto') return stats.culto || 0;
  if (cultoId === 'Parte1') return stats.parte1 || 0;
  if (cultoId === 'Parte2') return stats.parte2 || 0;
  if (cultoId === 'Reserva') return stats.reserva || 0;
  return stats.total || 0;
};

const createEmptyStats = () => ({
  meiaHora: 0,
  culto: 0,
  parte1: 0,
  parte2: 0,
  reserva: 0,
  total: 0,
});

const incrementStatsForCulto = (stats, cultoId) => {
  const next = {
    meiaHora: stats.meiaHora || 0,
    culto: stats.culto || 0,
    parte1: stats.parte1 || 0,
    parte2: stats.parte2 || 0,
    reserva: stats.reserva || 0,
    total: (stats.total || 0) + 1,
  };

  if (cultoId === 'MeiaHoraCulto') next.meiaHora += 1;
  if (cultoId === 'Culto') next.culto += 1;
  if (cultoId === 'Parte1') next.parte1 += 1;
  if (cultoId === 'Parte2') next.parte2 += 1;
  if (cultoId === 'Reserva') next.reserva += 1;

  return next;
};

const getRepeatedRolePenalty = (lastAssignedRoleByDayKey, organistId, dayKey, cultoId) => {
  if (cultoId === 'RJM') return 0;
  return lastAssignedRoleByDayKey[organistId]?.[dayKey] === cultoId ? 1 : 0;
};

const buildPeriodDates = (parsedStart, parsedEnd, churchConfig) => {
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
        cultos: cultosForThisDay,
      });
    }

    currentDate = addDays(currentDate, 1);
  }

  return periodDates;
};

const initializeAllocationState = (organists, periodDates) => {
  const organistStats = {};
  organists.forEach((org) => {
    organistStats[org.id] = org.stats
      ? { ...createEmptyStats(), ...org.stats }
      : createEmptyStats();
  });

  const assignedDates = {};
  const lastAssignedRoleByDayKey = {};
  organists.forEach((org) => {
    assignedDates[org.id] = new Set();
    lastAssignedRoleByDayKey[org.id] = {};
  });

  const schedule = periodDates.map((dayInfo) => ({
    date: dayInfo.dateStr,
    dayName: dayInfo.dayName,
    assignments: Object.fromEntries(dayInfo.cultos.map((culto) => [culto.id, undefined])),
  }));

  return { organistStats, assignedDates, lastAssignedRoleByDayKey, schedule };
};

const assignSingleCulto = ({
  organists,
  availabilityScores,
  dayOfWeek,
  dayKey,
  dateStr,
  culto,
  currentDayAssignments,
  assignedDates,
  lastAssignedRoleByDayKey,
  organistStats,
  churchConfig,
}) => {
  if (currentDayAssignments[culto.id]) return false;

  const candidates = organists
    .filter((organist) => {
      if (assignedDates[organist.id].has(dateStr)) return false;
      return canOrganistPlayOnDay(organist, dayOfWeek, dayKey, culto.id, churchConfig);
    })
    .sort((a, b) => {
      const statsA = organistStats[a.id] || createEmptyStats();
      const statsB = organistStats[b.id] || createEmptyStats();

      const scarcityDiff = (availabilityScores[a.id] || 0) - (availabilityScores[b.id] || 0);
      if (culto.id === 'RJM' && scarcityDiff !== 0) return scarcityDiff;

      const repeatPenaltyDiff =
        getRepeatedRolePenalty(lastAssignedRoleByDayKey, a.id, dayKey, culto.id) -
        getRepeatedRolePenalty(lastAssignedRoleByDayKey, b.id, dayKey, culto.id);
      if (repeatPenaltyDiff !== 0) return repeatPenaltyDiff;

      const totalDiff = (statsA.total || 0) - (statsB.total || 0);
      if (totalDiff !== 0) return totalDiff;

      const roleDiff =
        getRoleCountForCulto(statsA, culto.id) - getRoleCountForCulto(statsB, culto.id);
      if (roleDiff !== 0) return roleDiff;

      if (scarcityDiff !== 0) return scarcityDiff;

      return (a.name || '').localeCompare(b.name || '');
    });

  const selected = candidates[0];
  if (!selected) return false;

  currentDayAssignments[culto.id] = selected.name;
  assignedDates[selected.id].add(dateStr);

  const currentStats =
    organistStats[selected.id] ||
    (selected.stats ? { ...createEmptyStats(), ...selected.stats } : createEmptyStats());
  organistStats[selected.id] = incrementStatsForCulto(currentStats, culto.id);
  lastAssignedRoleByDayKey[selected.id][dayKey] = culto.id;

  return true;
};

const assignThreeSlotTeam = ({
  organists,
  availabilityScores,
  dayOfWeek,
  dayKey,
  dateStr,
  currentDayAssignments,
  assignedDates,
  lastAssignedRoleByDayKey,
  organistStats,
  churchConfig,
}) => {
  const roles = ['MeiaHoraCulto', 'Parte1', 'Parte2'];
  if (roles.some((roleId) => currentDayAssignments[roleId])) return false;

  const roleCandidates = Object.fromEntries(
    roles.map((roleId) => [
      roleId,
      organists.filter((organist) => {
        if (assignedDates[organist.id].has(dateStr)) return false;
        return canOrganistPlayOnDay(organist, dayOfWeek, dayKey, roleId, churchConfig);
      }),
    ])
  );

  if (roles.some((roleId) => roleCandidates[roleId].length === 0)) return false;

  let bestTeam = null;

  roleCandidates.MeiaHoraCulto.forEach((meiaHoraOrganist) => {
    roleCandidates.Parte1.forEach((parte1Organist) => {
      if (parte1Organist.id === meiaHoraOrganist.id) return;

      roleCandidates.Parte2.forEach((parte2Organist) => {
        if (parte2Organist.id === meiaHoraOrganist.id || parte2Organist.id === parte1Organist.id) {
          return;
        }

        const team = [
          { organist: meiaHoraOrganist, cultoId: 'MeiaHoraCulto' },
          { organist: parte1Organist, cultoId: 'Parte1' },
          { organist: parte2Organist, cultoId: 'Parte2' },
        ];

        const teamStats = team.map(({ organist, cultoId }) => {
          const stats = organistStats[organist.id] || createEmptyStats();
          return {
            repeatPenalty: getRepeatedRolePenalty(
              lastAssignedRoleByDayKey,
              organist.id,
              dayKey,
              cultoId
            ),
            roleCount: getRoleCountForCulto(stats, cultoId),
            total: stats.total || 0,
            scarcity: availabilityScores[organist.id] || 0,
          };
        });

        const teamScore = [
          teamStats.reduce((sum, item) => sum + item.repeatPenalty, 0),
          Math.max(...teamStats.map((item) => item.total)),
          teamStats.reduce((sum, item) => sum + item.total, 0),
          Math.max(...teamStats.map((item) => item.roleCount)),
          teamStats.reduce((sum, item) => sum + item.roleCount, 0),
          teamStats.reduce((sum, item) => sum + item.scarcity, 0),
          meiaHoraOrganist.name || '',
          parte1Organist.name || '',
          parte2Organist.name || '',
        ];

        if (!bestTeam || compareScoreTuples(teamScore, bestTeam.score) < 0) {
          bestTeam = {
            assignments: {
              MeiaHoraCulto: meiaHoraOrganist,
              Parte1: parte1Organist,
              Parte2: parte2Organist,
            },
            score: teamScore,
          };
        }
      });
    });
  });

  if (!bestTeam) return false;

  roles.forEach((roleId) => {
    const selected = bestTeam.assignments[roleId];
    currentDayAssignments[roleId] = selected.name;
    assignedDates[selected.id].add(dateStr);

    const currentStats =
      organistStats[selected.id] ||
      (selected.stats ? { ...createEmptyStats(), ...selected.stats } : createEmptyStats());
    organistStats[selected.id] = incrementStatsForCulto(currentStats, roleId);
    lastAssignedRoleByDayKey[selected.id][dayKey] = roleId;
  });

  return true;
};

const scoreCandidateForReservePair = ({
  organist,
  cultoId,
  dayKey,
  availabilityScores,
  organistStats,
  lastAssignedRoleByDayKey,
}) => {
  const stats = organistStats[organist.id] || createEmptyStats();

  return [
    getRepeatedRolePenalty(lastAssignedRoleByDayKey, organist.id, dayKey, cultoId),
    stats.total || 0,
    getRoleCountForCulto(stats, cultoId),
    availabilityScores[organist.id] || 0,
    organist.name || '',
  ];
};

const compareScoreTuples = (scoreA, scoreB) => {
  for (let index = 0; index < Math.max(scoreA.length, scoreB.length); index += 1) {
    const valueA = scoreA[index];
    const valueB = scoreB[index];

    if (valueA < valueB) return -1;
    if (valueA > valueB) return 1;
  }

  return 0;
};

const assignCultoWithReservePair = ({
  organists,
  availabilityScores,
  dayOfWeek,
  dayKey,
  dateStr,
  currentDayAssignments,
  assignedDates,
  lastAssignedRoleByDayKey,
  organistStats,
  churchConfig,
}) => {
  const cultoCandidates = organists.filter((organist) => {
    if (assignedDates[organist.id].has(dateStr)) return false;
    return canOrganistPlayOnDay(organist, dayOfWeek, dayKey, 'Culto', churchConfig);
  });

  let bestPair = null;

  cultoCandidates.forEach((cultoOrganist) => {
    const reserveCandidates = organists.filter((organist) => {
      if (organist.id === cultoOrganist.id) return false;
      if (assignedDates[organist.id].has(dateStr)) return false;
      return canOrganistPlayOnDay(organist, dayOfWeek, dayKey, 'Reserva', churchConfig);
    });

    reserveCandidates.forEach((reserveOrganist) => {
      const pairScore = [
        ...scoreCandidateForReservePair({
          organist: cultoOrganist,
          cultoId: 'Culto',
          dayKey,
          availabilityScores,
          organistStats,
          lastAssignedRoleByDayKey,
        }),
        ...scoreCandidateForReservePair({
          organist: reserveOrganist,
          cultoId: 'Reserva',
          dayKey,
          availabilityScores,
          organistStats,
          lastAssignedRoleByDayKey,
        }),
      ];

      if (!bestPair || compareScoreTuples(pairScore, bestPair.score) < 0) {
        bestPair = {
          cultoOrganist,
          reserveOrganist,
          score: pairScore,
        };
      }
    });
  });

  if (!bestPair) return false;

  currentDayAssignments.Culto = bestPair.cultoOrganist.name;
  currentDayAssignments.Reserva = bestPair.reserveOrganist.name;

  assignedDates[bestPair.cultoOrganist.id].add(dateStr);
  assignedDates[bestPair.reserveOrganist.id].add(dateStr);

  const cultoStats =
    organistStats[bestPair.cultoOrganist.id] ||
    (bestPair.cultoOrganist.stats
      ? { ...createEmptyStats(), ...bestPair.cultoOrganist.stats }
      : createEmptyStats());
  organistStats[bestPair.cultoOrganist.id] = incrementStatsForCulto(cultoStats, 'Culto');
  lastAssignedRoleByDayKey[bestPair.cultoOrganist.id][dayKey] = 'Culto';

  const reserveStats =
    organistStats[bestPair.reserveOrganist.id] ||
    (bestPair.reserveOrganist.stats
      ? { ...createEmptyStats(), ...bestPair.reserveOrganist.stats }
      : createEmptyStats());
  organistStats[bestPair.reserveOrganist.id] = incrementStatsForCulto(reserveStats, 'Reserva');
  lastAssignedRoleByDayKey[bestPair.reserveOrganist.id][dayKey] = 'Reserva';

  return true;
};

const runPrimaryAllocation = ({
  organists,
  availabilityScores,
  periodDates,
  schedule,
  assignedDates,
  lastAssignedRoleByDayKey,
  organistStats,
  churchConfig,
}) => {
  periodDates.forEach((dayInfo, dayIndex) => {
    const { date, dayOfWeek, dayKey, cultos } = dayInfo;
    const dateStr = format(date, 'yyyy-MM-dd');
    const currentDayAssignments = schedule[dayIndex].assignments || {};

    const hasCultoWithReserve =
      cultos.some((culto) => culto.id === 'Culto') &&
      cultos.some((culto) => culto.id === 'Reserva');

    if (hasCultoWithReserve) {
      assignCultoWithReservePair({
        organists,
        availabilityScores,
        dayOfWeek,
        dayKey,
        dateStr,
        currentDayAssignments,
        assignedDates,
        lastAssignedRoleByDayKey,
        organistStats,
        churchConfig,
      });
    }

    const hasThreeSlotTeam =
      cultos.some((culto) => culto.id === 'MeiaHoraCulto') &&
      cultos.some((culto) => culto.id === 'Parte1') &&
      cultos.some((culto) => culto.id === 'Parte2');

    if (hasThreeSlotTeam) {
      const rjmCulto = cultos.find((culto) => culto.id === 'RJM');
      if (rjmCulto) {
        assignSingleCulto({
          organists,
          availabilityScores,
          dayOfWeek,
          dayKey,
          dateStr,
          culto: rjmCulto,
          currentDayAssignments,
          assignedDates,
          lastAssignedRoleByDayKey,
          organistStats,
          churchConfig,
        });
      }

      assignThreeSlotTeam({
        organists,
        availabilityScores,
        dayOfWeek,
        dayKey,
        dateStr,
        currentDayAssignments,
        assignedDates,
        lastAssignedRoleByDayKey,
        organistStats,
        churchConfig,
      });
    }

    const orderedCultos = [...cultos].sort(
      (a, b) => (SERVICE_PRIORITY[a.id] ?? 99) - (SERVICE_PRIORITY[b.id] ?? 99)
    );

    orderedCultos.forEach((culto) => {
      assignSingleCulto({
        organists,
        availabilityScores,
        dayOfWeek,
        dayKey,
        dateStr,
        culto,
        currentDayAssignments,
        assignedDates,
        lastAssignedRoleByDayKey,
        organistStats,
        churchConfig,
      });
    });
  });
};

const applyDoubleDutyRule = ({ periodDates, schedule, organists, organistStats, churchConfig }) => {
  periodDates.forEach((dayInfo, dayIndex) => {
    const { dayOfWeek, dayKey, cultos } = dayInfo;
    const dayAssignments = schedule[dayIndex].assignments || {};

    const meiaHoraCulto = cultos.find((c) => c.id === 'MeiaHoraCulto');
    const cultoCulto = cultos.find((c) => c.id === 'Culto');
    if (!meiaHoraCulto || !cultoCulto) return;

    const meiaHoraAssigned = dayAssignments[meiaHoraCulto.id];
    const cultoAssigned = dayAssignments[cultoCulto.id];

    // Se Meia Hora está vazia mas Culto está preenchido
    if (!meiaHoraAssigned && cultoAssigned) {
      const organistName = cultoAssigned;
      const organist = organists.find((org) => org.name === organistName);
      if (!organist) return;

      const canPlayMeiaHora = canOrganistPlayOnDay(
        organist,
        dayOfWeek,
        dayKey,
        'MeiaHoraCulto',
        churchConfig
      );

      if (canPlayMeiaHora) {
        schedule[dayIndex].assignments[meiaHoraCulto.id] = organistName;

        const stats = organistStats[organist.id] || createEmptyStats();
        organistStats[organist.id] = incrementStatsForCulto(stats, 'MeiaHoraCulto');
      }
    }

    // Cenário simétrico: Culto vazio e Meia Hora preenchido
    if (!cultoAssigned && meiaHoraAssigned) {
      const organistName = meiaHoraAssigned;
      const organist = organists.find((org) => org.name === organistName);
      if (!organist) return;

      const canPlayCulto = canOrganistPlayOnDay(organist, dayOfWeek, dayKey, 'Culto', churchConfig);

      if (canPlayCulto) {
        schedule[dayIndex].assignments[cultoCulto.id] = organistName;

        const stats = organistStats[organist.id] || createEmptyStats();
        organistStats[organist.id] = incrementStatsForCulto(stats, 'Culto');
      }
    }
  });
};

/**
 * Função principal: Gera escala inicial justa baseada em fixedDays
 *
 * Algoritmo:
 * 1. Calcula availabilityScore (organistas restritas têm score baixo)
 * 2. Aloca por dia/culto, escolhendo menor carga total primeiro
 * 3. Em empates, prioriza equilíbrio por função e escassez (availabilityScore)
 * 4. Slots não preenchidos ficam como null/undefined (não "VAGO")
 *
 * @param {Array} organists - Array de organistas { id, name, fixedDays, stats }
 * @param {string} startDateStr - Data inicial (ISO string)
 * @param {string} endDateStr - Data final (ISO string)
 * @param {Object} churchConfig - Configuração da igreja com dias de culto
 * @returns {Array} Array de objetos { date, dayName, assignments: { cultoId: organistName } }
 */
export const generateSchedule = (organists, startDateStr, endDateStr, churchConfig = null) => {
  // Validações iniciais
  if (!organists || organists.length === 0) {
    logger.warn('Nenhum organista cadastrado para gerar escala.');
    return [];
  }

  if (!startDateStr || !endDateStr) {
    logger.error('Datas de início ou término inválidas.');
    return [];
  }

  const parsedStart = parseISO(startDateStr);
  const parsedEnd = parseISO(endDateStr);
  if (!isValid(parsedStart) || !isValid(parsedEnd) || parsedStart > parsedEnd) {
    logger.error('Datas de início ou término inválidas.');
    return [];
  }

  // Prepara periodDates: array de objetos representando cada dia do período
  const periodDates = buildPeriodDates(parsedStart, parsedEnd, churchConfig);

  if (periodDates.length === 0) {
    logger.warn('Nenhum dia de culto configurado no período.');
    return [];
  }

  // PASSO A: Calcula Availability Score para cada organista
  const availabilityScores = calculateAvailabilityScores(organists, periodDates, churchConfig);

  const { organistStats, assignedDates, lastAssignedRoleByDayKey, schedule } =
    initializeAllocationState(organists, periodDates);

  // PASSO C: Alocação e Equilíbrio (Loop Principal)
  runPrimaryAllocation({
    organists,
    availabilityScores,
    periodDates,
    schedule,
    assignedDates,
    lastAssignedRoleByDayKey,
    organistStats,
    churchConfig,
  });

  // PASSO D: Regra de Dobradinha (Double Duty) - Aplicar após alocação principal
  applyDoubleDutyRule({
    periodDates,
    schedule,
    organists,
    organistStats,
    churchConfig,
  });

  // Tratamento de Falhas: slots não preenchidos ficam como null/undefined
  // (não preenche com "VAGO" - usuário preencherá manualmente depois)
  // Os slots já estão como undefined por padrão, então não precisamos fazer nada

  return schedule;
};
