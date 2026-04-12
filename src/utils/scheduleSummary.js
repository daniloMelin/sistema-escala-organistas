export const buildOrganistDistributionSummary = (scheduleData = []) => {
  const counts = {};

  scheduleData.forEach((day) => {
    Object.values(day.assignments || {}).forEach((assignedName) => {
      if (!assignedName || assignedName === 'VAGO') {
        return;
      }

      counts[assignedName] = (counts[assignedName] || 0) + 1;
    });
  });

  return Object.entries(counts)
    .map(([name, count]) => ({ name, count }))
    .sort((itemA, itemB) => {
      if (itemB.count !== itemA.count) {
        return itemB.count - itemA.count;
      }

      return itemA.name.localeCompare(itemB.name, 'pt-BR');
    });
};
