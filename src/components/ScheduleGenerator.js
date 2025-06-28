import React, { useState, useEffect, useCallback } from 'react';
import { getOrganists, saveSchedule, getRecentSchedules } from '../services/firebaseService';
import { generateSchedule as generateScheduleLogic } from '../utils/scheduleLogic';
import { exportScheduleToPDF } from '../utils/pdfGenerator';

const ScheduleGenerator = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [generatedSchedule, setGeneratedSchedule] = useState([]);
  const [organists, setOrganists] = useState([]);
  const [isLoadingOrganists, setIsLoadingOrganists] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false); // Controla o estado do botão "Gerar e Salvar Escala"
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const [savedSchedules, setSavedSchedules] = useState([]);
  const [isLoadingSavedSchedules, setIsLoadingSavedSchedules] = useState(false);

  const clearMessages = useCallback(() => {
    setError('');
    setSuccessMessage('');
  }, []);

  const fetchOrganistsData = useCallback(async () => {
    setIsLoadingOrganists(true);
    try {
      const orgs = await getOrganists();
      setOrganists(orgs);
    } catch (err) {
      setError("Falha ao carregar organistas.");
      console.error("Erro em fetchOrganistsData:", err);
    }
    setIsLoadingOrganists(false);
  }, []);

  const loadSavedSchedules = useCallback(async () => {
    setIsLoadingSavedSchedules(true);
    try {
      const schedulesData = await getRecentSchedules(3);
      setSavedSchedules(schedulesData);
    } catch (err) {
      setError("Falha ao carregar escalas salvas.");
      console.error("Erro em loadSavedSchedules:", err);
    }
    setIsLoadingSavedSchedules(false);
  }, []);

  useEffect(() => {
    fetchOrganistsData();
    loadSavedSchedules();
  }, [fetchOrganistsData, loadSavedSchedules]);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(''), 4000); // Aumentei um pouco o tempo
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const handleGenerateSchedule = async () => {
    console.log("handleGenerateSchedule: INÍCIO, isGenerating =", isGenerating);
    clearMessages();
    setGeneratedSchedule([]);

    if (!startDate || !endDate) {
      setError("Por favor, selecione o período completo.");
      return;
    }
    // ... (outras validações) ...

    setIsGenerating(true);
    console.log("handleGenerateSchedule: MEIO, isGenerating SET TO TRUE");
    try {
      const currentOrganists = await getOrganists(); // Busca organistas mais recentes
      setOrganists(currentOrganists);

      if (currentOrganists.length === 0) {
        setError("Nenhum organista encontrado para gerar a escala. Cadastre organistas.");
        // setIsGenerating(false); // Já está no finally
        return;
      }

      const schedule = generateScheduleLogic(currentOrganists, startDate, endDate);
      setGeneratedSchedule(schedule);

      if (schedule.length > 0) {
        const scheduleId = `escala_${startDate.replace(/-/g, '')}_ate_${endDate.replace(/-/g, '')}_${Date.now()}`;
        const scheduleToSave = {
          period: { start: startDate, end: endDate },
          generatedAt: new Date().toISOString(),
          data: schedule,
          organistCountOnGeneration: currentOrganists.length
        };
        await saveSchedule(scheduleId, scheduleToSave);
        setSuccessMessage("Escala gerada e salva com sucesso!");
        await loadSavedSchedules();
      } else {
        setError("Nenhuma escala pôde ser gerada. Verifique as disponibilidades.");
      }
      console.log("handleGenerateSchedule: TRY CONCLUÍDO");
    } catch (err) {
      setError(`Erro ao gerar ou salvar a escala: ${err.message || "Erro desconhecido"}`);
      console.error("Erro em handleGenerateSchedule:", err);
    } finally {
      setIsGenerating(false);
      console.log("handleGenerateSchedule: FINALLY, isGenerating SET TO FALSE");
    }
  };

  const handleExportPDF = () => {
    clearMessages(); // Limpa mensagens de erro/sucesso anteriores
    if (generatedSchedule.length === 0) {
      setError("Gere uma escala primeiro para exportar.");
      return;
    }
    try {
      exportScheduleToPDF(generatedSchedule, startDate, endDate);
      setSuccessMessage("PDF exportado com sucesso! A visualização foi limpa.");

      // "Atualiza" a tela limpando a escala gerada da visualização.
      setGeneratedSchedule([]);

      // Opcional: Limpar as datas de início e fim se quiser um reset completo do formulário de geração.
      // setStartDate('');
      // setEndDate('');
      // Se você limpar startDate e endDate, a parte do título "Escala Atual (xx a yy)" também ficará vazia.

      console.log("handleExportPDF: PDF exportado, visualização limpa. isGenerating =", isGenerating);
      // Nota: 'isGenerating' não é alterado aqui, pois se refere à geração da escala, não à exportação.
      // Se o botão "Gerar e Salvar Escala" estiver como "Gerando..." neste ponto,
      // o problema está no fluxo de 'handleGenerateSchedule'.

    } catch (pdfError) {
      setError(`Erro ao gerar PDF: ${pdfError.message}`);
      console.error("Erro em handleExportPDF:", pdfError);
    }
  };

  const handleViewSavedSchedule = (scheduleData) => {
    clearMessages();
    setGeneratedSchedule(scheduleData.data);
    if (scheduleData.period) {
        setStartDate(scheduleData.period.start);
        setEndDate(scheduleData.period.end);
    }
    setSuccessMessage(`Visualizando escala salva de ${scheduleData.period?.start ? new Date(scheduleData.period.start + "T00:00:00").toLocaleDateString() : 'N/A'} a ${scheduleData.period?.end ? new Date(scheduleData.period.end + "T00:00:00").toLocaleDateString() : 'N/A'}`);
  };


  if (isLoadingOrganists) {
    return <div style={{ padding: '20px', textAlign: 'center' }}>Carregando dados dos organistas...</div>;
  }

  return (
    <div style={{ padding: '20px', maxWidth: '900px', margin: 'auto' }}>
      <section>
        <h2>Gerar Nova Escala</h2>
        {organists.length === 0 && !isLoadingOrganists && ( // Adicionado !isLoadingOrganists para não mostrar enquanto carrega
          <p style={{ color: 'orange', border: '1px solid orange', padding: '10px', borderRadius: '4px' }}>
            Atenção: Nenhum organista cadastrado. Vá para "Cadastro de Organistas" para adicionar.
          </p>
        )}
        <div style={{ marginBottom: '20px', display: 'flex', flexWrap: 'wrap', gap: '15px', alignItems: 'flex-end', padding: '15px', border: '1px solid #ddd', borderRadius: '4px' }}>
          <div>
            <label htmlFor="startDate" style={{ display: 'block', marginBottom: '5px' }}>Data de Início:</label>
            <input type="date" id="startDate" value={startDate} onChange={(e) => setStartDate(e.target.value)} style={{ padding: '8px' }} />
          </div>
          <div>
            <label htmlFor="endDate" style={{ display: 'block', marginBottom: '5px' }}>Data de Término:</label>
            <input type="date" id="endDate" value={endDate} onChange={(e) => setEndDate(e.target.value)} style={{ padding: '8px' }} />
          </div>
          <button onClick={handleGenerateSchedule} disabled={isGenerating || organists.length === 0} style={{ padding: '10px 15px', cursor: (isGenerating || organists.length === 0) ? 'not-allowed' : 'pointer', backgroundColor: '#2196F3', color: 'white', border: 'none', borderRadius: '4px', height: 'fit-content', opacity: (isGenerating || organists.length === 0) ? 0.6 : 1 }}>
            {isGenerating ? 'Gerando...' : 'Gerar e Salvar Escala'}
          </button>
        </div>
        {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
        {successMessage && <p style={{ color: 'green', marginTop: '10px' }}>{successMessage}</p>}
      </section>

      {generatedSchedule.length > 0 && (
        <section style={{ marginTop: '30px' }}>
          <h3 style={{ borderBottom: '1px solid #ccc', paddingBottom: '10px', marginBottom: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            Escala Atual ({startDate ? new Date(startDate + "T00:00:00").toLocaleDateString() : ''} a {endDate ? new Date(endDate + "T00:00:00").toLocaleDateString() : ''})
            <button 
              onClick={handleExportPDF} 
              style={{ padding: '8px 12px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }} 
              disabled={isGenerating} // Desabilita se a GERAÇÃO da escala estiver em andamento
            >
              Exportar para PDF
            </button>
          </h3>
          {generatedSchedule.map((item, index) => (
            <div key={`${item.date}-${index}`} style={{ marginBottom: '15px', paddingBottom: '10px', borderBottom: '1px dashed #eee' }}>
              <h4>{item.dayName}, {item.date}</h4>
              <ul style={{ listStyle: 'none', paddingLeft: '20px' }}>
                {item.assignments.RJM && <li>RJM – {item.assignments.RJM}</li>}
                {item.assignments.MeiaHoraCulto && <li>(Meia Hora) – {item.assignments.MeiaHoraCulto}</li>}
                {item.assignments.Culto && <li>(Culto) – {item.assignments.Culto}</li>}
                {Object.keys(item.assignments).length === 0 && <li>Nenhum culto definido para este dia ou sem organistas.</li>}
                {Object.values(item.assignments).includes('VAGO') && <li style={{color: 'orange'}}>Atenção: Algum horário ficou vago.</li>}
              </ul>
            </div>
          ))}
        </section>
      )}
      
      <section style={{ marginTop: '40px', borderTop: '2px solid #007bff', paddingTop: '20px' }}>
        <h2>Últimas 3 Escalas Salvas</h2>
        {isLoadingSavedSchedules && <p>Carregando escalas salvas...</p>}
        {!isLoadingSavedSchedules && savedSchedules.length === 0 && <p>Nenhuma escala salva encontrada.</p>}
        {!isLoadingSavedSchedules && savedSchedules.length > 0 && (
          <ul style={{ listStyleType: 'none', padding: 0 }}>
            {savedSchedules.map(sch => (
              <li key={sch.id} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px', borderRadius: '4px' }}>
                <strong>Período:</strong> {sch.period?.start ? new Date(sch.period.start + "T00:00:00").toLocaleDateString() : 'N/A'} - {sch.period?.end ? new Date(sch.period.end + "T00:00:00").toLocaleDateString() : 'N/A'}
                <br />
                <small>Gerada em: {sch.generatedAt ? new Date(sch.generatedAt).toLocaleString() : 'N/A'}</small>
                <br />
                <button onClick={() => handleViewSavedSchedule(sch)} style={{marginTop: '5px', padding: '5px 10px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '3px'}}>
                  Visualizar esta Escala
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};

export default ScheduleGenerator;