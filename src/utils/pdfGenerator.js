import jsPDF from 'jspdf';
import { getMonthYearLabel } from './dateUtils';
import logger from './logger';
import { getServiceSortPriority } from './scheduleLogic';
import { buildOrganistDistributionSummary } from './scheduleSummary';

const COLORS = {
  titleBg: [37, 63, 101],
  titleText: [255, 255, 255],
  monthBg: [51, 104, 153],
  monthText: [255, 255, 255],
  weekdayBg: [37, 63, 101],
  weekdayText: [255, 255, 255],
  cellBorder: [204, 214, 224],
  emptyCellBg: [248, 250, 252],
  activeCellBg: [255, 255, 255],
  textPrimary: [37, 49, 66],
  textMuted: [120, 130, 144],
  summaryBg: [246, 248, 252],
};

const WEEKDAY_LABELS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

const SERVICE_SHORT_LABELS = {
  RJM: 'RJM',
  MeiaHoraCulto: 'M. Hora',
  Culto: 'Culto',
  Parte1: 'P1',
  Parte2: 'P2',
  Reserva: 'Res.',
};

const hasValidAssignments = (assignments) => {
  if (!assignments || Object.keys(assignments).length === 0) {
    return false;
  }

  return Object.values(assignments).some((value) => value && value.toUpperCase() !== 'VAGO');
};

const parseScheduleDate = (date) => {
  const [day, month, year] = date.split('/').map(Number);
  return new Date(year, month - 1, day);
};

const getRenderableAssignments = (assignments) =>
  Object.entries(assignments || {})
    .filter(([, value]) => value && value !== 'VAGO')
    .sort(
      ([serviceA], [serviceB]) =>
        getServiceSortPriority(serviceA) - getServiceSortPriority(serviceB)
    )
    .map(
      ([serviceId, assignedName]) =>
        `${SERVICE_SHORT_LABELS[serviceId] || serviceId} ${assignedName}`
    );

const buildMonths = (scheduleData) => {
  const monthMap = new Map();

  scheduleData.forEach((item) => {
    const parsedDate = parseScheduleDate(item.date);
    const key = `${parsedDate.getFullYear()}-${parsedDate.getMonth()}`;

    if (!monthMap.has(key)) {
      monthMap.set(key, {
        key,
        year: parsedDate.getFullYear(),
        monthIndex: parsedDate.getMonth(),
        label: getMonthYearLabel(item.date),
        itemsByDay: {},
      });
    }

    monthMap.get(key).itemsByDay[parsedDate.getDate()] = item;
  });

  return Array.from(monthMap.values()).sort((monthA, monthB) => {
    if (monthA.year !== monthB.year) {
      return monthA.year - monthB.year;
    }

    return monthA.monthIndex - monthB.monthIndex;
  });
};

const drawCenteredText = (doc, text, x, y, width, fontSize = 6.3) => {
  doc.setFontSize(fontSize);
  doc.text(text, x + width / 2, y, { align: 'center' });
};

const drawHeader = (doc, pageWidth, margin, churchName, startDate, endDate) => {
  doc.setFillColor(...COLORS.titleBg);
  doc.rect(margin, margin, pageWidth - margin * 2, 15, 'F');

  doc.setTextColor(...COLORS.titleText);
  doc.setFont(undefined, 'bold');
  doc.setFontSize(16);
  doc.text(churchName || 'Escala de Organistas', pageWidth / 2, margin + 6.2, {
    align: 'center',
  });

  const startFmt = startDate ? startDate.split('-').reverse().join('/') : 'N/A';
  const endFmt = endDate ? endDate.split('-').reverse().join('/') : 'N/A';

  doc.setFont(undefined, 'normal');
  doc.setFontSize(8.4);
  doc.text(`Escala de Organistas · ${startFmt} a ${endFmt}`, pageWidth / 2, margin + 11.2, {
    align: 'center',
  });
};

const drawMonthCalendar = (doc, month, x, y, width, height) => {
  const monthHeaderHeight = 6;
  const weekdayHeaderHeight = 5;
  const cellTop = y + monthHeaderHeight + weekdayHeaderHeight;
  const cellHeight = (height - monthHeaderHeight - weekdayHeaderHeight) / 6;
  const cellWidth = width / 7;
  const firstDay = new Date(month.year, month.monthIndex, 1).getDay();
  const daysInMonth = new Date(month.year, month.monthIndex + 1, 0).getDate();

  doc.setFillColor(...COLORS.monthBg);
  doc.rect(x, y, width, monthHeaderHeight, 'F');
  doc.setTextColor(...COLORS.monthText);
  doc.setFont(undefined, 'bold');
  drawCenteredText(doc, month.label.toUpperCase(), x, y + 4.1, width, 8.5);

  WEEKDAY_LABELS.forEach((weekday, index) => {
    const cellX = x + index * cellWidth;
    doc.setFillColor(...COLORS.weekdayBg);
    doc.rect(cellX, y + monthHeaderHeight, cellWidth, weekdayHeaderHeight, 'F');
    doc.setTextColor(...COLORS.weekdayText);
    doc.setFont(undefined, 'bold');
    drawCenteredText(doc, weekday, cellX, y + monthHeaderHeight + 3.3, cellWidth, 5.8);
  });

  for (let index = 0; index < 42; index += 1) {
    const row = Math.floor(index / 7);
    const column = index % 7;
    const cellX = x + column * cellWidth;
    const cellY = cellTop + row * cellHeight;
    const dayNumber = index - firstDay + 1;
    const inMonth = dayNumber > 0 && dayNumber <= daysInMonth;

    doc.setFillColor(...(inMonth ? COLORS.activeCellBg : COLORS.emptyCellBg));
    doc.setDrawColor(...COLORS.cellBorder);
    doc.setLineWidth(0.1);
    doc.rect(cellX, cellY, cellWidth, cellHeight, 'FD');

    if (!inMonth) {
      continue;
    }

    const item = month.itemsByDay[dayNumber];

    doc.setTextColor(...COLORS.textPrimary);
    doc.setFont(undefined, 'bold');
    doc.setFontSize(5.4);
    doc.text(String(dayNumber).padStart(2, '0'), cellX + 1.4, cellY + 3.4);

    if (!item) {
      continue;
    }

    const lines = getRenderableAssignments(item.assignments).slice(0, 3);

    doc.setFont(undefined, 'normal');
    doc.setFontSize(4.6);
    lines.forEach((line, lineIndex) => {
      doc.text(line, cellX + 1.2, cellY + 7 + lineIndex * 3.2);
    });
  }
};

const drawDistributionSummary = (doc, items, x, y, width) => {
  if (items.length === 0) {
    return;
  }

  doc.setFillColor(...COLORS.summaryBg);
  doc.rect(x, y, width, 19, 'F');

  doc.setTextColor(...COLORS.textPrimary);
  doc.setFont(undefined, 'bold');
  doc.setFontSize(8.2);
  doc.text('Resumo do período', x + 2, y + 4.1);

  doc.setFont(undefined, 'normal');
  doc.setFontSize(6.6);
  doc.setTextColor(...COLORS.textMuted);
  doc.text('Quantidade de vezes por organista.', x + 2, y + 7.6);

  const columns = Math.min(4, Math.max(1, Math.ceil(items.length / 3)));
  const columnWidth = width / columns;

  doc.setTextColor(...COLORS.textPrimary);
  doc.setFont(undefined, 'bold');
  doc.setFontSize(6.3);

  for (let columnIndex = 0; columnIndex < columns; columnIndex += 1) {
    const headerX = x + columnIndex * columnWidth;
    doc.text('Nome', headerX + 2, y + 11.8);
    doc.text('Qtd', headerX + columnWidth - 3, y + 11.8, { align: 'right' });
  }

  doc.setDrawColor(...COLORS.cellBorder);
  doc.setLineWidth(0.1);
  doc.line(x + 2, y + 13, x + width - 2, y + 13);

  doc.setFontSize(6.5);
  items.forEach((item, index) => {
    const column = index % columns;
    const row = Math.floor(index / columns);
    const lineX = x + column * columnWidth;
    const lineY = y + 16.3 + row * 3.1;

    doc.setFont(undefined, 'normal');
    doc.text(item.name, lineX + 2, lineY);
    doc.setFont(undefined, 'bold');
    doc.text(String(item.count), lineX + columnWidth - 3, lineY, { align: 'right' });
  });
};

export const exportScheduleToPDF = (scheduleData, startDate, endDate, churchName) => {
  try {
    if (!scheduleData || scheduleData.length === 0) {
      throw new Error('Não há dados na escala para gerar o PDF.');
    }

    const validItems = scheduleData.filter((item) => hasValidAssignments(item.assignments));
    const months = buildMonths(validItems);
    const distributionSummary = buildOrganistDistributionSummary(validItems);

    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 8;
    const gap = 4;
    const footerHeight = 6;
    const monthsPerPage = 3;

    for (let startIndex = 0; startIndex < months.length; startIndex += monthsPerPage) {
      if (startIndex > 0) {
        doc.addPage();
      }

      drawHeader(doc, pageWidth, margin, churchName, startDate, endDate);

      const currentMonths = months.slice(startIndex, startIndex + monthsPerPage);
      const isLastPage = startIndex + monthsPerPage >= months.length;
      const summaryHeight = isLastPage && distributionSummary.length > 0 ? 21 : 0;
      const contentTop = margin + 18;
      const availableHeight = pageHeight - contentTop - margin - footerHeight - summaryHeight;
      const monthHeight =
        (availableHeight - gap * (currentMonths.length - 1)) / currentMonths.length;
      const monthWidth = pageWidth - margin * 2;

      currentMonths.forEach((month, index) => {
        const monthY = contentTop + index * (monthHeight + gap);
        drawMonthCalendar(doc, month, margin, monthY, monthWidth, monthHeight);
      });

      if (isLastPage && distributionSummary.length > 0) {
        drawDistributionSummary(
          doc,
          distributionSummary,
          margin,
          pageHeight - margin - footerHeight - summaryHeight + 1,
          pageWidth - margin * 2
        );
      }
    }

    const pageCount = doc.internal.getNumberOfPages();
    for (let pageIndex = 1; pageIndex <= pageCount; pageIndex += 1) {
      doc.setPage(pageIndex);
      doc.setFontSize(8);
      doc.setTextColor(150);
      doc.text(`Página ${pageIndex} de ${pageCount}`, pageWidth - margin, pageHeight - 3, {
        align: 'right',
      });
    }

    const safeChurchName = (churchName || 'escala')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-zA-Z0-9 ]/g, '')
      .trim()
      .replace(/\s+/g, '_')
      .toLowerCase();

    const fileDate = startDate || 'period';
    doc.save(`${safeChurchName}_${fileDate}.pdf`);
  } catch (error) {
    logger.error('Erro ao gerar PDF:', error);
    throw error;
  }
};
