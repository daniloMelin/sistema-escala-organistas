import jsPDF from 'jspdf';

const hasValidAssignments = (assignments) => {
  if (!assignments || Object.keys(assignments).length === 0) {
    return false;
  }
  return Object.values(assignments).some(value => value && value.toUpperCase() !== 'VAGO');
};

export const exportScheduleToPDF = (scheduleData, startDate, endDate, churchName) => {
  try {
    // 1. Validação inicial
    if (!scheduleData || scheduleData.length === 0) {
      alert("Não há dados na escala para gerar o PDF.");
      return;
    }

    // 2. Criação do documento
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });
    
    let yPos = 20;
    const lineHeight = 7;
    const leftMargin = 15;
    // Largura útil da página
    const pageWidth = doc.internal.pageSize.getWidth ? doc.internal.pageSize.getWidth() : doc.internal.pageSize.width;
    const contentWidth = pageWidth - (leftMargin * 2);

    // 3. Cabeçalho
    doc.setFontSize(18);
    doc.setFont(undefined, 'bold');
    
    const title = churchName ? `Escala - ${churchName}` : 'Escala de Organistas';
    
    // Tentativa simplificada de centralizar
    doc.text(title, pageWidth / 2, yPos, { align: 'center' });
    yPos += lineHeight + 5;

    // 4. Subtítulo (Período)
    doc.setFontSize(12);
    doc.setFont(undefined, 'normal');
    
    // Formata datas com segurança
    const startFmt = startDate ? startDate.split('-').reverse().join('/') : 'N/A';
    const endFmt = endDate ? endDate.split('-').reverse().join('/') : 'N/A';
    
    doc.text(`Período: ${startFmt} a ${endFmt}`, pageWidth / 2, yPos, { align: 'center' });
    yPos += lineHeight * 2;

    // 5. Loop dos dias
    scheduleData.forEach(item => {
      // Pula dias vazios
      if (!hasValidAssignments(item.assignments)) return;

      // Verificação de quebra de página
      if (yPos > 270) { // 270mm é perto do fim da A4
        doc.addPage();
        yPos = 20;
      }

      // Data
      doc.setFontSize(14);
      doc.setFont(undefined, 'bold');
      doc.text(`${item.dayName}, ${item.date}`, leftMargin, yPos);
      yPos += lineHeight;

      // Designações
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
      
      yPos += 4; // Espaço entre dias
    });

    // 6. Salvar
    const safeName = (churchName || 'escala').replace(/[^a-z0-9]/gi, '_').toLowerCase();
    doc.save(`${safeName}_${startDate}.pdf`);

  } catch (error) {
    console.error("Erro ao gerar PDF:", error);
    alert(`Erro ao gerar PDF: ${error.message}. Verifique o console (F12) para detalhes.`);
  }
};