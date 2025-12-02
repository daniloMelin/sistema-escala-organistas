
import jsPDF from 'jspdf';

// Cores padrão (RGB)
const COLORS = {
  headerBg: [41, 128, 185],   // Azul forte
  headerText: [255, 255, 255],// Branco
  cardBorder: [200, 200, 200],// Cinza borda
  cardHeader: [240, 240, 240],// Cinza bem claro
  textDate: [0, 0, 0],        // Preto
  textLabel: [100, 100, 100], // Cinza
  textValue: [40, 40, 40]     // Cinza escuro
};

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

    // --- CONFIGURAÇÕES DE LAYOUT (GRID 3 COLUNAS) ---
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 10; // Margem da página
    const gap = 4;     // Espaço entre os cartões (reduzido para caber melhor)
    const columns = 3; // Agora são 3 colunas

    // Cálculo da largura: (Pagina - MargensLaterais - EspaçosEntreCartoes) / 3
    const cardWidth = (pageWidth - (margin * 2) - (gap * (columns - 1))) / columns;
    
    // Altura fixa do cartão
    const cardHeight = 30; 

    let yPos = 50; 

    // --- 1. DESENHAR CABEÇALHO ---
    const drawHeader = () => {
        doc.setFillColor(...COLORS.headerBg);
        doc.rect(0, 0, pageWidth, 40, 'F');

        doc.setFontSize(20); // Levemente menor para garantir que nomes longos de igreja caibam
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

    drawHeader();

    const validItems = scheduleData.filter(item => hasValidAssignments(item.assignments));

    // --- 2. LOOP DOS ITENS ---
    validItems.forEach((item, index) => {
        
        // 0, 1 ou 2 (Coluna Esquerda, Meio, Direita)
        const columnIndex = index % columns; 
        
        // Se voltamos para a coluna 0 (e não é o primeiro item), pula linha
        if (index > 0 && columnIndex === 0) {
            yPos += cardHeight + gap;
        }

        // Verifica quebra de página
        if (yPos + cardHeight > pageHeight - margin) {
            doc.addPage();
            drawHeader();
            yPos = 50; 
        }

        const xPos = margin + (columnIndex * (cardWidth + gap));

        // --- DESENHAR O CARTÃO ---
        
        // Fundo e Borda
        doc.setDrawColor(...COLORS.cardBorder);
        doc.setLineWidth(0.1);
        doc.setFillColor(255, 255, 255);
        doc.roundedRect(xPos, yPos, cardWidth, cardHeight, 2, 2, 'FD');

        // Cabeçalho do Cartão (Data)
        doc.setFillColor(...COLORS.cardHeader);
        doc.rect(xPos + 0.1, yPos + 0.1, cardWidth - 0.2, 7, 'F'); // Topo cinza

        // Texto da Data (Fonte ajustada para 9 ou 10 para caber "Domingo, 30/11/2025")
        doc.setFontSize(9); 
        doc.setFont(undefined, 'bold');
        doc.setTextColor(...COLORS.textDate);
        // Abreviação do dia para economizar espaço se necessário, ou usa normal
        // item.dayName ex: "Domingo" -> "Dom" (opcional, mantendo normal por enquanto)
        doc.text(`${item.dayName}, ${item.date}`, xPos + (cardWidth / 2), yPos + 5, { align: 'center' });

        // Conteúdo
        let lineY = yPos + 13;
        doc.setFontSize(9); // Fonte menor para o conteúdo caber na coluna estreita

        const drawRow = (label, name) => {
            // Rótulo
            doc.setFont(undefined, 'bold');
            doc.setTextColor(...COLORS.textLabel);
            doc.text(label, xPos + 2, lineY);
            
            // Valor (Nome)
            doc.setFont(undefined, 'normal');
            doc.setTextColor(...COLORS.textValue);
            
            // Cálculo para alinhar o nome sempre na mesma posição horizontal dentro do card
            // Como "Meia Hora:" é longo, jogamos o nome um pouco mais para a direita
            // Se o nome for muito longo, ele pode sobrepor. O splitText resolve isso.
            const nameX = xPos + 20; 
            const maxWidth = cardWidth - 22; // Espaço disponível para o nome
            
            // Se o nome for muito grande, corta ou quebra (aqui estamos simplificando para 1 linha)
            if (doc.getTextWidth(name) > maxWidth) {
                 // Opção: diminuir fonte se nome for gigante
                 doc.setFontSize(8);
                 doc.text(name, nameX, lineY);
                 doc.setFontSize(9); // volta ao normal
            } else {
                 doc.text(name, nameX, lineY);
            }
            
            lineY += 6; // Espaço menor entre linhas
        };

        if (item.assignments.RJM && item.assignments.RJM !== 'VAGO') {
            drawRow("RJM:", item.assignments.RJM);
        }
        if (item.assignments.MeiaHoraCulto && item.assignments.MeiaHoraCulto !== 'VAGO') {
            drawRow("M. Hora:", item.assignments.MeiaHoraCulto); // Abreviei para caber melhor
        }
        if (item.assignments.Culto && item.assignments.Culto !== 'VAGO') {
            drawRow("Culto:", item.assignments.Culto);
        }
    });

    // --- RODAPÉ ---
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150);
        doc.text(`Página ${i} de ${pageCount}`, pageWidth - margin, pageHeight - 5, { align: 'right' });
    }

    // --- SALVAR ---
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