import jsPDF from 'jspdf';
import { getMonthYearLabel } from './dateUtils';
import logger from './logger';
import { getServiceDisplayLabel, getServiceSortPriority } from './scheduleLogic';
import { buildOrganistDistributionSummary } from './scheduleSummary';

const COLORS = {
  titleBg: [37, 63, 101],
  titleText: [255, 255, 255],
  monthBg: [51, 104, 153],
  monthText: [255, 255, 255],
  tableHeaderBg: [37, 63, 101],
  tableHeaderText: [255, 255, 255],
  rowEven: [246, 249, 252],
  rowOdd: [235, 241, 247],
  border: [202, 214, 226],
  textPrimary: [37, 49, 66],
  textMuted: [110, 121, 137],
  summaryBg: [246, 248, 252],
};

const hasValidAssignments = (assignments) => {
  if (!assignments || Object.keys(assignments).length === 0) {
    return false;
  }

  return Object.values(assignments).some((value) => value && value.toUpperCase() !== 'VAGO');
};

const getServiceColumns = (scheduleData) =>
  Array.from(new Set(scheduleData.flatMap((item) => Object.keys(item.assignments || {})))).sort(
    (serviceA, serviceB) => getServiceSortPriority(serviceA) - getServiceSortPriority(serviceB)
  );

const getServiceHeaderLabel = (serviceId) => {
  if (serviceId === 'MeiaHoraCulto') {
    return 'M. Hora';
  }

  return getServiceDisplayLabel(serviceId);
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

const drawCenteredCellText = (doc, text, x, y, width, baseFontSize = 6.1) => {
  const value = text || '—';
  let fontSize = baseFontSize;

  if (doc.getTextWidth(value) > width - 3) {
    fontSize = 5.4;
  }

  doc.setFontSize(fontSize);
  doc.text(value, x + width / 2, y, { align: 'center' });
};

const drawHeader = (doc, pageWidth, margin, churchName, startDate, endDate) => {
  doc.setFillColor(...COLORS.titleBg);
  doc.rect(margin, margin, pageWidth - margin * 2, 14, 'F');

  doc.setTextColor(...COLORS.titleText);
  doc.setFont(undefined, 'bold');
  doc.setFontSize(17);
  doc.text(churchName || 'Escala de Organistas', pageWidth / 2, margin + 6.5, {
    align: 'center',
  });

  const startFmt = startDate ? startDate.split('-').reverse().join('/') : 'N/A';
  const endFmt = endDate ? endDate.split('-').reverse().join('/') : 'N/A';

  doc.setFont(undefined, 'normal');
  doc.setFontSize(8.5);
  doc.text(`Escala de Organistas · ${startFmt} a ${endFmt}`, pageWidth / 2, margin + 11.2, {
    align: 'center',
  });
};

const drawMonthTable = (doc, monthLabel, items, serviceColumns, x, y, width, height) => {
  const monthHeaderHeight = 6;
  const tableHeaderHeight = 5;
  const tableTop = y + monthHeaderHeight + 2;
  const bodyHeight = height - monthHeaderHeight - tableHeaderHeight - 2;
  const rowCount = items.length;

  doc.setFillColor(...COLORS.monthBg);
  doc.rect(x, y, width, monthHeaderHeight, 'F');
  doc.setTextColor(...COLORS.monthText);
  doc.setFont(undefined, 'bold');
  doc.setFontSize(8.5);
  doc.text(monthLabel.toUpperCase(), x + width / 2, y + 4.2, { align: 'center' });

  const dateColumnWidth = 24;
  const serviceWidth = (width - dateColumnWidth) / serviceColumns.length;
  const rowHeight = Math.max(4.2, Math.min(5.2, bodyHeight / Math.max(rowCount, 1)));

  doc.setFillColor(...COLORS.tableHeaderBg);
  doc.rect(x, tableTop, width, tableHeaderHeight, 'F');
  doc.setTextColor(...COLORS.tableHeaderText);
  doc.setFontSize(6.5);

  let columnX = x;
  const headerY = tableTop + 3.3;
  drawCenteredCellText(doc, 'Data', columnX, headerY, dateColumnWidth, 6.3);
  columnX += dateColumnWidth;

  serviceColumns.forEach((serviceId) => {
    drawCenteredCellText(
      doc,
      getServiceHeaderLabel(serviceId),
      columnX,
      headerY,
      serviceWidth,
      6.1
    );
    columnX += serviceWidth;
  });

  items.forEach((item, index) => {
    const rowY = tableTop + tableHeaderHeight + index * rowHeight;
    const textY = rowY + rowHeight / 2 + 1;

    doc.setFillColor(...(index % 2 === 0 ? COLORS.rowEven : COLORS.rowOdd));
    doc.rect(x, rowY, width, rowHeight, 'F');

    doc.setDrawColor(...COLORS.border);
    doc.setLineWidth(0.1);
    doc.rect(x, rowY, width, rowHeight);

    let rowColumnX = x;
    doc.setTextColor(...COLORS.textPrimary);
    doc.setFont(undefined, 'bold');
    drawCenteredCellText(
      doc,
      `${getShortDayName(item.dayName)} ${item.date.slice(0, 5)}`,
      rowColumnX,
      textY,
      dateColumnWidth,
      6.1
    );
    rowColumnX += dateColumnWidth;

    serviceColumns.forEach((serviceId) => {
      doc.setFont(undefined, 'normal');
      drawCenteredCellText(
        doc,
        item.assignments?.[serviceId] || '—',
        rowColumnX,
        textY,
        serviceWidth
      );
      rowColumnX += serviceWidth;
    });
  });
};

const drawDistributionSummary = (doc, items, x, y, width) => {
  if (items.length === 0) {
    return;
  }

  doc.setFillColor(...COLORS.summaryBg);
  doc.rect(x, y, width, 19, 'F');

  doc.setTextColor(...COLORS.textPrimary);
  doc.setFont(undefined, 'bold');
  doc.setFontSize(8.5);
  doc.text('Resumo do período', x + 2, y + 4.2);

  doc.setTextColor(...COLORS.textMuted);
  doc.setFont(undefined, 'normal');
  doc.setFontSize(6.8);
  doc.text('Quantidade de vezes por organista.', x + 2, y + 7.8);

  const columns = Math.min(4, Math.max(1, Math.ceil(items.length / 3)));
  const columnWidth = width / columns;

  doc.setTextColor(...COLORS.textPrimary);
  doc.setFont(undefined, 'bold');
  doc.setFontSize(6.5);
  for (let columnIndex = 0; columnIndex < columns; columnIndex += 1) {
    const headerX = x + columnIndex * columnWidth;
    doc.text('Nome', headerX + 2, y + 12);
    doc.text('Qtd', headerX + columnWidth - 3, y + 12, { align: 'right' });
  }

  doc.setDrawColor(...COLORS.border);
  doc.setLineWidth(0.1);
  doc.line(x + 2, y + 13.2, x + width - 2, y + 13.2);

  doc.setFontSize(6.7);
  items.forEach((item, index) => {
    const column = index % columns;
    const row = Math.floor(index / columns);
    const lineX = x + column * columnWidth;
    const lineY = y + 16.7 + row * 3.2;

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
    const serviceColumns = getServiceColumns(validItems);
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
      const summaryHeight = isLastPage && distributionSummary.length > 0 ? 21 : 0;
      const contentTop = margin + 18;
      const contentHeight = pageHeight - contentTop - margin - footerHeight - summaryHeight;
      const contentWidth = pageWidth - margin * 2;
      const columns = currentMonths.length === 1 ? 1 : 2;
      const rows = Math.ceil(currentMonths.length / columns);
      const blockWidth = (contentWidth - gap * (columns - 1)) / columns;
      const blockHeight = (contentHeight - gap * (rows - 1)) / rows;

      currentMonths.forEach((monthLabel, index) => {
        const column = index % columns;
        const row = Math.floor(index / columns);
        const blockX = margin + column * (blockWidth + gap);
        const blockY = contentTop + row * (blockHeight + gap);

        drawMonthTable(
          doc,
          monthLabel,
          itemsByMonth[monthLabel],
          serviceColumns,
          blockX,
          blockY,
          blockWidth,
          blockHeight
        );
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
