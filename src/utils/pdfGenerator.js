import jsPDF from 'jspdf';
import { getMonthYearLabel } from './dateUtils';
import logger from './logger';
import { getServiceDisplayLabel, getServiceSortPriority } from './scheduleLogic';

// Cores padrão (RGB)
const COLORS = {
  headerBg: [41, 128, 185], // Azul forte (Cabeçalho Página)
  headerText: [255, 255, 255], // Branco

  monthBg: [230, 230, 230], // Cinza (Barra do Mês)
  monthText: [60, 60, 60], // Cinza escuro

  cardBorder: [200, 200, 200], // Cinza borda
  cardHeader: [245, 245, 245], // Cinza bem claro (Topo do Card)

  textDate: [0, 0, 0], // Preto
  textLabel: [100, 100, 100], // Cinza
  textValue: [40, 40, 40], // Cinza escuro
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

const drawPdfRow = (doc, xPos, cardWidth, lineY, label, name) => {
  doc.setFont(undefined, 'bold');
  doc.setTextColor(...COLORS.textLabel);
  doc.text(label, xPos + 2, lineY);

  doc.setFont(undefined, 'normal');
  doc.setTextColor(...COLORS.textValue);

  const nameX = xPos + 20;
  const maxWidth = cardWidth - 22;

  if (doc.getTextWidth(name) > maxWidth) {
    doc.setFontSize(8);
    doc.text(name, nameX, lineY);
    doc.setFontSize(9);
  } else {
    doc.text(name, nameX, lineY);
  }

  return lineY + 6;
};

export const exportScheduleToPDF = (scheduleData, startDate, endDate, churchName) => {
  try {
    if (!scheduleData || scheduleData.length === 0) {
      throw new Error('Não há dados na escala para gerar o PDF.');
    }

    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    // --- CONFIGURAÇÕES DE LAYOUT ---
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 10;
    const gap = 4;
    const columns = 3;

    const contentWidth = pageWidth - margin * 2;
    const cardWidth = (contentWidth - gap * (columns - 1)) / columns;
    let yPos = 50; // Começa em 50 na primeira página (por causa do cabeçalho)

    // --- 1. FUNÇÃO DE CABEÇALHO (Só desenha quando chamado) ---
    const drawHeader = () => {
      doc.setFillColor(...COLORS.headerBg);
      doc.rect(0, 0, pageWidth, 40, 'F');

      doc.setFontSize(20);
      doc.setTextColor(...COLORS.headerText);
      doc.setFont(undefined, 'bold');
      const title = churchName || 'Escala de Organistas';
      doc.text(title, pageWidth / 2, 20, { align: 'center' });

      doc.setFontSize(11);
      doc.setFont(undefined, 'normal');
      const startFmt = startDate ? startDate.split('-').reverse().join('/') : 'N/A';
      const endFmt = endDate ? endDate.split('-').reverse().join('/') : 'N/A';
      doc.text(`Período: ${startFmt} a ${endFmt}`, pageWidth / 2, 30, { align: 'center' });
    };

    // Desenha o cabeçalho APENAS na primeira página
    drawHeader();

    const validItems = scheduleData.filter((item) => hasValidAssignments(item.assignments));
    const itemsByMonth = {};

    validItems.forEach((item) => {
      const monthKey = getMonthYearLabel(item.date);
      if (!itemsByMonth[monthKey]) {
        itemsByMonth[monthKey] = [];
      }
      itemsByMonth[monthKey].push(item);
    });

    // --- 2. LOOP PELOS MESES ---
    Object.keys(itemsByMonth).forEach((monthLabel) => {
      const items = itemsByMonth[monthLabel];

      // Verificar espaço para a barra do mês
      const tallestCardInMonth = Math.max(
        ...items.map((item) => 16 + getRenderableAssignments(item.assignments).length * 6),
        28
      );

      if (yPos + 15 + tallestCardInMonth > pageHeight - margin) {
        doc.addPage();
        // NÃO chamamos drawHeader() aqui
        yPos = 20; // Reinicia no topo (margem simples)
      }

      // --- BARRA DO MÊS ---
      doc.setFillColor(...COLORS.monthBg);
      doc.rect(margin, yPos, contentWidth, 8, 'F');

      doc.setFontSize(11);
      doc.setFont(undefined, 'bold');
      doc.setTextColor(...COLORS.monthText);
      doc.text(monthLabel.toUpperCase(), pageWidth / 2, yPos + 5.5, { align: 'center' });

      yPos += 12;

      // --- LOOP PELOS ITENS ---
      for (let rowStart = 0; rowStart < items.length; rowStart += columns) {
        const rowItems = items.slice(rowStart, rowStart + columns);
        const rowHeights = rowItems.map((item) =>
          Math.max(28, 16 + getRenderableAssignments(item.assignments).length * 6)
        );
        const rowMaxHeight = Math.max(...rowHeights);

        if (yPos + rowMaxHeight > pageHeight - margin) {
          doc.addPage();
          yPos = 20;
        }

        for (let columnIndex = 0; columnIndex < rowItems.length; columnIndex += 1) {
          const item = rowItems[columnIndex];
          const renderableAssignments = getRenderableAssignments(item.assignments);
          const cardHeight = rowHeights[columnIndex];
          const xPos = margin + columnIndex * (cardWidth + gap);

          doc.setDrawColor(...COLORS.cardBorder);
          doc.setLineWidth(0.1);
          doc.setFillColor(255, 255, 255);
          doc.roundedRect(xPos, yPos, cardWidth, cardHeight, 2, 2, 'FD');

          doc.setFillColor(...COLORS.cardHeader);
          doc.rect(xPos + 0.1, yPos + 0.1, cardWidth - 0.2, 7, 'F');

          doc.setFontSize(9);
          doc.setFont(undefined, 'bold');
          doc.setTextColor(...COLORS.textDate);
          doc.text(`${item.dayName}, ${item.date}`, xPos + cardWidth / 2, yPos + 5, {
            align: 'center',
          });

          let lineY = yPos + 13;
          doc.setFontSize(9);

          renderableAssignments.forEach(([serviceId, assignedName]) => {
            lineY = drawPdfRow(
              doc,
              xPos,
              cardWidth,
              lineY,
              `${getServiceDisplayLabel(serviceId)}:`,
              assignedName
            );
          });
        }

        yPos += rowMaxHeight + gap;
      }

      yPos += 5;
    });

    // --- RODAPÉ ---
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(150);
      doc.text(`Página ${i} de ${pageCount}`, pageWidth - margin, pageHeight - 5, {
        align: 'right',
      });
    }

    // --- SALVAR ---
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
