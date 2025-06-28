import jsPDF from 'jspdf';

/**
 * Verifica se um dia tem alguma designação válida (não VAGO).
 * @param {object} assignments - O objeto de designações para um dia.
 * @returns {boolean} True se houver ao menos uma designação válida, false caso contrário.
 */
const hasValidAssignments = (assignments) => {
  if (!assignments || Object.keys(assignments).length === 0) {
    return false;
  }
  return Object.values(assignments).some(value => value && value.toUpperCase() !== 'VAGO');
};

/**
 * Exporta a escala fornecida para um arquivo PDF.
 * @param {Array<object>} scheduleData - Array de objetos da escala.
 * @param {string} startDate - Data de início da escala.
 * @param {string} endDate - Data de término da escala.
 */
export const exportScheduleToPDF = (scheduleData, startDate, endDate) => {
  if (!scheduleData || scheduleData.length === 0) {
    console.warn("Nenhum dado de escala para exportar para PDF.");
    return;
  }

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });
  
  let yPos = 20;
  const lineHeight = 7;
  const sectionSpacing = 4;
  const leftMargin = 15;
  const contentWidth = doc.internal.pageSize.getWidth() - leftMargin * 2;

  doc.setFontSize(18);
  doc.text('Escala de Organistas', doc.internal.pageSize.getWidth() / 2, yPos, { align: 'center' });
  yPos += lineHeight;

  doc.setFontSize(12);
  const startDateFormatted = startDate ? new Date(startDate + "T00:00:00").toLocaleDateString() : 'N/A';
  const endDateFormatted = endDate ? new Date(endDate + "T00:00:00").toLocaleDateString() : 'N/A';
  doc.text(`Período: ${startDateFormatted} a ${endDateFormatted}`, doc.internal.pageSize.getWidth() / 2, yPos, { align: 'center' });
  yPos += lineHeight * 2;

  scheduleData.forEach(item => {
    // MODIFICAÇÃO: Pular o dia se não houver designações válidas
    if (!hasValidAssignments(item.assignments)) {
      return; // Pula para o próximo dia no loop
    }

    let estimatedLinesForItem = 1;
    if (item.assignments.RJM && item.assignments.RJM.toUpperCase() !== 'VAGO') estimatedLinesForItem++;
    if (item.assignments.MeiaHoraCulto && item.assignments.MeiaHoraCulto.toUpperCase() !== 'VAGO') estimatedLinesForItem++;
    if (item.assignments.Culto && item.assignments.Culto.toUpperCase() !== 'VAGO') estimatedLinesForItem++;
    
    if (yPos + (estimatedLinesForItem * lineHeight) > doc.internal.pageSize.getHeight() - 20) {
      doc.addPage();
      yPos = 20;
    }

    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text(`${item.dayName}, ${item.date}`, leftMargin, yPos);
    yPos += lineHeight;

    doc.setFontSize(12);
    doc.setFont(undefined, 'normal');

    const assignmentsText = [];
    if (item.assignments.RJM && item.assignments.RJM.toUpperCase() !== 'VAGO') {
      assignmentsText.push(`RJM – ${item.assignments.RJM}`);
    }
    if (item.assignments.MeiaHoraCulto && item.assignments.MeiaHoraCulto.toUpperCase() !== 'VAGO') {
      assignmentsText.push(`(Meia Hora) – ${item.assignments.MeiaHoraCulto}`);
    }
    if (item.assignments.Culto && item.assignments.Culto.toUpperCase() !== 'VAGO') {
      assignmentsText.push(`(Culto) – ${item.assignments.Culto}`);
    }
    
    // Se, após filtrar os VAGOs, não sobrar nada, não precisa imprimir "Sem designações"
    // porque a checagem hasValidAssignments já deve ter pego isso.
    // Mas, para segurança, se hasValidAssignments for mais permissivo:
    // if (assignmentsText.length === 0) {
    //    assignmentsText.push("Sem designações válidas para este dia.");
    // }

    assignmentsText.forEach(textLine => {
        const splitText = doc.splitTextToSize(textLine, contentWidth - 5);
        doc.text(splitText, leftMargin + 5, yPos);
        yPos += (splitText.length * lineHeight) - (lineHeight * (splitText.length > 1 ? 0.3 : 0));
    });
    
    yPos += sectionSpacing;
  });

  const filename = `escala_organistas_${startDate || 'inicio'}_a_${endDate || 'fim'}.pdf`;
  doc.save(filename.replace(/-/g, '_'));
};