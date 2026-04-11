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
  headerBg: [37, 63, 101],
  headerText: [255, 255, 255],
  rowAltBg: [246, 248, 252],
  border: [212, 220, 230],
  textPrimary: [37, 49, 66],
  textMuted: [110, 121, 138],
  summaryBg: [248, 250, 252],
};

const SERVICE_SHORT_LABELS = {
  RJM: 'RJM',
  MeiaHoraCulto: 'M. Hora',
  Culto: 'Culto',
  Parte1: 'P1',
  Parte2: 'P2',
  Reserva: 'Res.',
};

const DAY_SHORT_LABELS = {
  Domingo: 'Dom',
  Segunda: 'Seg',
  Terca: 'Ter',
  Terça: 'Ter',
  Quarta: 'Qua',
  Quinta: 'Qui',
  Sexta: 'Sex',
  Sábado: 'Sáb',
  Sabado: 'Sáb',
};

const MONTHS_PER_PAGE = 3;
const ROWS_PER_MONTH = 14;

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

const truncateName = (name, maxLength = 10) =>
  name && name.length > maxLength ? `${name.slice(0, maxLength - 1)}.` : name;

const getServiceLabel = (serviceId) => SERVICE_SHORT_LABELS[serviceId] || serviceId;

const getDayDateLabel = (item) => {
  const parsedDate = parseScheduleDate(item.date);
  const dayLabel = DAY_SHORT_LABELS[item.dayName] || item.dayName?.slice(0, 3) || '';
  const day = String(parsedDate.getDate()).padStart(2, '0');
  const month = String(parsedDate.getMonth() + 1).padStart(2, '0');
  return `${dayLabel} ${day}/${month}`;
};

const collectServiceIds = (scheduleData) => {
  const ids = new Set();

  scheduleData.forEach((item) => {
    Object.entries(item.assignments || {}).forEach(([serviceId, assignedName]) => {
      if (!assignedName || assignedName === 'VAGO') return;
      ids.add(serviceId);
    });
  });

  return Array.from(ids).sort((serviceA, serviceB) => {
    const priorityDiff = getServiceSortPriority(serviceA) - getServiceSortPriority(serviceB);
    if (priorityDiff !== 0) return priorityDiff;
    return serviceA.localeCompare(serviceB, 'pt-BR');
  });
};

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
        items: [],
      });
    }

    monthMap.get(key).items.push(item);
  });

  return Array.from(monthMap.values())
    .sort((monthA, monthB) => {
      if (monthA.year !== monthB.year) {
        return monthA.year - monthB.year;
      }

      return monthA.monthIndex - monthB.monthIndex;
    })
    .map((month) => ({
      ...month,
      items: month.items.sort(
        (itemA, itemB) =>
          parseScheduleDate(itemA.date).getTime() - parseScheduleDate(itemB.date).getTime()
      ),
    }));
};

const drawHeader = (doc, pageWidth, margin, churchName, startDate, endDate) => {
  doc.setFillColor(...COLORS.titleBg);
  doc.rect(margin, margin, pageWidth - margin * 2, 14, 'F');

  doc.setTextColor(...COLORS.titleText);
  doc.setFont(undefined, 'bold');
  doc.setFontSize(16);
  doc.text(churchName || 'Escala de Organistas', pageWidth / 2, margin + 5.6, {
    align: 'center',
  });

  const startFmt = startDate ? startDate.split('-').reverse().join('/') : 'N/A';
  const endFmt = endDate ? endDate.split('-').reverse().join('/') : 'N/A';

  doc.setFont(undefined, 'normal');
  doc.setFontSize(8.2);
  doc.text(`Escala de Organistas · ${startFmt} a ${endFmt}`, pageWidth / 2, margin + 10.4, {
    align: 'center',
  });
};

const drawMonthTable = (doc, month, serviceIds, x, y, width, height) => {
  const monthHeaderHeight = 7;
  const tableHeaderHeight = 6;
  const bodyRows = Math.max(ROWS_PER_MONTH, month.items.length);
  const bodyHeight = height - monthHeaderHeight - tableHeaderHeight;
  const rowHeight = bodyHeight / bodyRows;

  const dateWidth = 18;
  const serviceAreaWidth = width - dateWidth;
  const serviceWidth = serviceAreaWidth / Math.max(serviceIds.length, 1);

  doc.setFillColor(...COLORS.monthBg);
  doc.rect(x, y, width, monthHeaderHeight, 'F');
  doc.setTextColor(...COLORS.monthText);
  doc.setFont(undefined, 'bold');
  doc.setFontSize(8.5);
  doc.text(month.label.toUpperCase(), x + width / 2, y + 4.7, { align: 'center' });

  const headerY = y + monthHeaderHeight;
  doc.setFillColor(...COLORS.headerBg);
  doc.rect(x, headerY, width, tableHeaderHeight, 'F');
  doc.setTextColor(...COLORS.headerText);
  doc.setFont(undefined, 'bold');
  doc.setFontSize(5.6);
  doc.text('Data', x + dateWidth / 2, headerY + 4, { align: 'center' });

  serviceIds.forEach((serviceId, index) => {
    const cellX = x + dateWidth + index * serviceWidth;
    doc.text(getServiceLabel(serviceId), cellX + serviceWidth / 2, headerY + 4, {
      align: 'center',
    });
  });

  doc.setDrawColor(...COLORS.border);
  doc.setLineWidth(0.1);
  doc.line(x + dateWidth, headerY, x + dateWidth, headerY + tableHeaderHeight + bodyHeight);
  serviceIds.forEach((_, index) => {
    const lineX = x + dateWidth + (index + 1) * serviceWidth;
    doc.line(lineX, headerY, lineX, headerY + tableHeaderHeight + bodyHeight);
  });

  month.items.forEach((item, rowIndex) => {
    const rowY = headerY + tableHeaderHeight + rowIndex * rowHeight;

    if (rowIndex % 2 === 1) {
      doc.setFillColor(...COLORS.rowAltBg);
      doc.rect(x, rowY, width, rowHeight, 'F');
    }

    doc.setTextColor(...COLORS.textPrimary);
    doc.setFont(undefined, 'bold');
    doc.setFontSize(5.3);
    doc.text(getDayDateLabel(item), x + 1.4, rowY + rowHeight * 0.68);

    serviceIds.forEach((serviceId, index) => {
      const cellX = x + dateWidth + index * serviceWidth;
      const assignedName = item.assignments?.[serviceId];
      const text = assignedName && assignedName !== 'VAGO' ? truncateName(assignedName, 10) : '—';

      doc.setFont(undefined, assignedName && assignedName !== 'VAGO' ? 'normal' : 'normal');
      doc.setFontSize(5.1);
      doc.text(text, cellX + serviceWidth / 2, rowY + rowHeight * 0.68, { align: 'center' });
    });
  });

  for (let rowIndex = 0; rowIndex <= bodyRows; rowIndex += 1) {
    const lineY = headerY + tableHeaderHeight + rowIndex * rowHeight;
    doc.line(x, lineY, x + width, lineY);
  }

  doc.rect(x, headerY, width, tableHeaderHeight + bodyHeight);
};

const drawDistributionSummary = (doc, items, x, y, width, height) => {
  if (items.length === 0) {
    return;
  }

  doc.setFillColor(...COLORS.summaryBg);
  doc.setDrawColor(...COLORS.border);
  doc.setLineWidth(0.2);
  doc.roundedRect(x, y, width, height, 2.5, 2.5, 'FD');

  doc.setTextColor(...COLORS.textPrimary);
  doc.setFont(undefined, 'bold');
  doc.setFontSize(7.8);
  doc.text('Resumo do período', x + 3, y + 5);

  doc.setFont(undefined, 'normal');
  doc.setFontSize(5.8);
  doc.setTextColor(...COLORS.textMuted);
  doc.text('Quantidade de vezes por organista.', x + 3, y + 8.7);

  const cols = width >= 48 ? 2 : 1;
  const colWidth = width / cols;
  const rowsPerCol = Math.ceil(items.length / cols);

  items.forEach((item, index) => {
    const col = Math.floor(index / rowsPerCol);
    const row = index % rowsPerCol;
    const itemX = x + col * colWidth + 3;
    const lineY = y + 13 + row * 3.8;

    doc.setTextColor(...COLORS.textPrimary);
    doc.setFont(undefined, 'normal');
    doc.setFontSize(5.9);
    doc.text(truncateName(item.name, 13), itemX, lineY);

    doc.setFont(undefined, 'bold');
    doc.text(String(item.count), x + (col + 1) * colWidth - 3, lineY, { align: 'right' });
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
    const serviceIds = collectServiceIds(validItems);

    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4',
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 8;
    const gap = 4;
    const headerHeight = 18;
    const footerHeight = 6;
    const summaryWidth = distributionSummary.length > 0 ? 44 : 0;
    const contentTop = margin + headerHeight;
    const availableHeight = pageHeight - contentTop - margin - footerHeight;

    for (let startIndex = 0; startIndex < months.length; startIndex += MONTHS_PER_PAGE) {
      if (startIndex > 0) {
        doc.addPage();
      }

      drawHeader(doc, pageWidth, margin, churchName, startDate, endDate);

      const currentMonths = months.slice(startIndex, startIndex + MONTHS_PER_PAGE);
      const isLastPage = startIndex + MONTHS_PER_PAGE >= months.length;
      const pageSummaryWidth = isLastPage ? summaryWidth : 0;
      const monthAreaWidth =
        pageWidth - margin * 2 - pageSummaryWidth - (pageSummaryWidth > 0 ? gap : 0);
      const monthWidth = (monthAreaWidth - gap * (MONTHS_PER_PAGE - 1)) / MONTHS_PER_PAGE;

      currentMonths.forEach((month, index) => {
        const monthX = margin + index * (monthWidth + gap);
        drawMonthTable(doc, month, serviceIds, monthX, contentTop, monthWidth, availableHeight);
      });

      if (isLastPage && distributionSummary.length > 0) {
        drawDistributionSummary(
          doc,
          distributionSummary,
          margin + monthAreaWidth + gap,
          contentTop,
          pageSummaryWidth,
          availableHeight
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
