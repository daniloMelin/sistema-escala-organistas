import jsPDF from 'jspdf';

const hasValidAssignments = (assignments) => {
  if (!assignments || Object.keys(assignments).length === 0) {
    return false;
  }
  return Object.values(assignments).some(value => value && value.toUpperCase() !== 'VAGO');
};

export const exportScheduleToPDF = (scheduleData, startDate, endDate, churchName) => {
  try {
    if (!scheduleData || scheduleData.length === 0) {
      alert("Não há dados na escala para gerar o PDF.");
      return;
    }

    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });
    
    let yPos = 20;
    const lineHeight = 7;
    const leftMargin = 15;
    const pageWidth = doc.internal.pageSize.getWidth ? doc.internal.pageSize.getWidth() : doc.internal.pageSize.width;
    const contentWidth = pageWidth - (leftMargin * 2);

    // --- CABEÇALHO ---
    doc.setFontSize(18);
    doc.setFont(undefined, 'bold');
    
    const title = churchName ? `Escala - ${churchName}` : 'Escala de Organistas';
    doc.text(title, pageWidth / 2, yPos, { align: 'center' });
    yPos += lineHeight + 5;

    doc.setFontSize(12);
    doc.setFont(undefined, 'normal');
    
    const startFmt = startDate ? startDate.split('-').reverse().join('/') : 'N/A';
    const endFmt = endDate ? endDate.split('-').reverse().join('/') : 'N/A';
    
    doc.text(`Período: ${startFmt} a ${endFmt}`, pageWidth / 2, yPos, { align: 'center' });
    yPos += lineHeight * 2;

    // --- CONTEÚDO ---
    scheduleData.forEach(item => {
      if (!hasValidAssignments(item.assignments)) return;

      if (yPos > 270) { 
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
      if (item.assignments.RJM && item.assignments.RJM !== 'VAGO') {
        assignmentsText.push(`RJM: ${item.assignments.RJM}`);
      }
      if (item.assignments.MeiaHoraCulto && item.assignments.MeiaHoraCulto !== 'VAGO') {
        assignmentsText.push(`Meia Hora: ${item.assignments.MeiaHoraCulto}`);
      }
      if (item.assignments.Culto && item.assignments.Culto !== 'VAGO') {
        assignmentsText.push(`Culto: ${item.assignments.Culto}`);
      }
      
      assignmentsText.forEach(textLine => {
          const splitText = doc.splitTextToSize(textLine, contentWidth);
          doc.text(splitText, leftMargin + 5, yPos);
          yPos += (splitText.length * lineHeight);
      });
      
      yPos += 4; 
    });

    // --- CORREÇÃO DO NOME DO ARQUIVO ---
    // 1. Normaliza (separa 'á' em 'a' + '´')
    // 2. Remove os acentos
    // 3. Remove caracteres especiais
    // 4. Troca espaços por _
    const safeChurchName = (churchName || 'escala')
      .normalize("NFD") 
      .replace(/[\u0300-\u036f]/g, "") 
      .replace(/[^a-zA-Z0-9 ]/g, "") 
      .trim()
      .replace(/\s+/g, '_') 
      .toLowerCase();

    doc.save(`${safeChurchName}_${startDate}.pdf`);

  } catch (error) {
    console.error("Erro ao gerar PDF:", error);
    alert(`Erro ao gerar PDF: ${error.message}`);
  }
};