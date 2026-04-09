import jsPDF from 'jspdf';
import { getMonthYearLabel } from './dateUtils';
import logger from './logger';
import { getServiceSortPriority } from './scheduleLogic';
import { buildOrganistDistributionSummary } from './scheduleSummary';

const COLORS = {
  headerBg: [41, 128, 185],
  headerText: [255, 255, 255],
  monthBg: [230, 230, 230],
  monthText: [60, 60, 60],
  cardBorder: [200, 200, 200],
  textDate: [0, 0, 0],
  textLabel: [100, 100, 100],
  textValue: [40, 40, 40],
};

const SERVICE_SHORT_LABELS = {
  RJM: 'RJM',
  MeiaHoraCulto: 'M. Hora',
  Culto: 'Culto',
  Parte1: 'P1',
  Parte2: 'P2',
  Reserva: 'Res',
};

const hasValidAssignments = (assignments) => {
  if (!assignments || Object.keys(assignments).length === 0) {
    return false;
  }

  return Object.values(assignments).some((value) => value && value.toUpperCase() !== 'VAGO');
};

const getRenderableAssignments = (assignments) =>
  Object.entries(assignments || {})
    .filter(([, value]) => value && value !== 'VAGO')
    .sort(
      ([serviceA], [serviceB]) =>
        getServiceSortPriority(serviceA) - getServiceSortPriority(serviceB)
    );

const getCompactAssignmentSegments = (assignments) =>
  getRenderableAssignments(assignments).map(
    ([serviceId, assignedName]) => `${SERVICE_SHORT_LABELS[serviceId] || serviceId} ${assignedName}`
  );

const getCompactAssignmentLines = (assignments) => {
  const segments = getCompactAssignmentSegments(assignments);

  if (segments.length <= 2) {
    return [segments.join(' | ')];
  }

  return [segments.slice(0, 2).join(' | '), segments.slice(2).join(' | ')];
};

const getShortDayName = (dayName) => {
  const labels = {
    Domingo: 'Dom',
    Segunda: 'Seg',
    Terça: 'Ter',
    Quarta: 'Qua',
    Quinta: 'Qui',
    Sexta: 'Sex',
    Sábado: 'Sáb',
  };

  return labels[dayName] || dayName;
};

const drawHeader = (doc, pageWidth, margin, churchName, startDate, endDate) => {
  doc.setFillColor(...COLORS.headerBg);
  doc.roundedRect(margin, margin, pageWidth - margin * 2, 12, 3, 3, 'F');

  doc.setFontSize(14);
  doc.setTextColor(...COLORS.headerText);
  doc.setFont(undefined, 'bold');
  doc.text(churchName || 'Escala de Organistas', pageWidth / 2, margin + 4.8, {
    align: 'center',
  });

  doc.setFontSize(8);
  doc.setFont(undefined, 'normal');
  const startFmt = startDate ? startDate.split('-').reverse().join('/') : 'N/A';
  const endFmt = endDate ? endDate.split('-').reverse().join('/') : 'N/A';
  doc.text(`Período: ${startFmt} a ${endFmt}`, pageWidth / 2, margin + 9, {
    align: 'center',
  });
};

const drawDistributionSummary = (doc, items, x, y, width) => {
  if (items.length === 0) {
    return;
  }

  doc.setFillColor(246, 248, 252);
  doc.roundedRect(x, y, width, 23, 2, 2, 'F');

  doc.setFontSize(9);
  doc.setFont(undefined, 'bold');
  doc.setTextColor(...COLORS.monthText);
  doc.text('Resumo do período', x + 3, y + 5);

  doc.setFontSize(7);
  doc.setFont(undefined, 'normal');
  doc.setTextColor(...COLORS.textLabel);
  doc.text('Quantidade de vezes por organista.', x + 3, y + 9);

  doc.setFontSize(7);
  doc.setFont(undefined, 'bold');
  doc.text('Nome', x + 3, y + 13);

  const columns = Math.min(4, Math.max(1, Math.ceil(items.length / 3)));
  const columnWidth = width / columns;

  for (let columnIndex = 1; columnIndex <= columns; columnIndex += 1) {
    doc.text('Qtd', x + columnIndex * columnWidth - 5, y + 13, { align: 'right' });
  }

  doc.setFillColor(220, 226, 235);
  doc.rect(x + 3, y + 14.5, width - 6, 0.4, 'F');

  doc.setFontSize(7.5);
  doc.setTextColor(...COLORS.textValue);

  items.forEach((item, index) => {
    const column = index % columns;
    const row = Math.floor(index / columns);
    const lineX = x + column * columnWidth + 3;
    const lineY = y + 18 + row * 3.6;

    doc.setFont(undefined, 'bold');
    doc.text(item.name, lineX, lineY);
    doc.setFont(undefined, 'normal');
    doc.text(String(item.count), x + (column + 1) * columnWidth - 5, lineY, {
      align: 'right',
    });
  });
};

export const exportScheduleToPDF = (scheduleData, startDate, endDate, churchName) => {
  try {
    if (!scheduleData || scheduleData.length === 0) {
      throw new Error('Não há dados na escala para gerar o PDF.');
    }

    const validItems = scheduleData.filter((item) => hasValidAssignments(item.assignments));
    const distributionSummary = buildOrganistDistributionSummary(validItems);
    const itemsByMonth = {};

    validItems.forEach((item) => {
      const monthKey = getMonthYearLabel(item.date);
      if (!itemsByMonth[monthKey]) {
        itemsByMonth[monthKey] = [];
      }
      itemsByMonth[monthKey].push(item);
    });

    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4',
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 8;
    const gap = 4;
    const footerHeight = 6;
    const monthLabels = Object.keys(itemsByMonth);
    const monthsPerPage = 4;

    for (let startIndex = 0; startIndex < monthLabels.length; startIndex += monthsPerPage) {
      if (startIndex > 0) {
        doc.addPage();
      }

      drawHeader(doc, pageWidth, margin, churchName, startDate, endDate);

      const currentMonths = monthLabels.slice(startIndex, startIndex + monthsPerPage);
      const isLastPage = startIndex + monthsPerPage >= monthLabels.length;
      const summaryHeight = isLastPage && distributionSummary.length > 0 ? 27 : 0;
      const contentTop = margin + 15;
      const contentBottom = pageHeight - margin - footerHeight - summaryHeight;
      const contentWidth = pageWidth - margin * 2;
      const monthWidth = (contentWidth - gap * (currentMonths.length - 1)) / currentMonths.length;

      currentMonths.forEach((monthLabel, monthIndex) => {
        const monthX = margin + monthIndex * (monthWidth + gap);
        let monthY = contentTop;

        doc.setFillColor(...COLORS.monthBg);
        doc.roundedRect(monthX, monthY, monthWidth, 7, 2, 2, 'F');
        doc.setFontSize(8.5);
        doc.setFont(undefined, 'bold');
        doc.setTextColor(...COLORS.monthText);
        doc.text(monthLabel.toUpperCase(), monthX + monthWidth / 2, monthY + 4.8, {
          align: 'center',
        });

        monthY += 9;

        itemsByMonth[monthLabel].forEach((item) => {
          const dateLine = `${getShortDayName(item.dayName)} ${item.date.slice(0, 5)}`;
          const assignmentLines = getCompactAssignmentLines(item.assignments);
          const rowHeight = 5 + assignmentLines.length * 3.2;

          if (monthY + rowHeight > contentBottom) {
            return;
          }

          doc.setDrawColor(...COLORS.cardBorder);
          doc.setLineWidth(0.1);
          doc.roundedRect(monthX, monthY, monthWidth, rowHeight, 1.5, 1.5);

          doc.setFontSize(7);
          doc.setFont(undefined, 'bold');
          doc.setTextColor(...COLORS.textDate);
          doc.text(dateLine, monthX + 2, monthY + 3.5);

          doc.setFontSize(6.4);
          doc.setFont(undefined, 'normal');
          doc.setTextColor(...COLORS.textValue);
          doc.text(assignmentLines, monthX + 2, monthY + 6.5);

          monthY += rowHeight + 2;
        });
      });

      if (isLastPage && distributionSummary.length > 0) {
        drawDistributionSummary(
          doc,
          distributionSummary,
          margin,
          pageHeight - margin - footerHeight - summaryHeight,
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
