import React, { useState, useEffect, useCallback } from 'react';
import { getOrganists, saveSchedule, getRecentSchedules } from '../services/firebaseService';
import { generateSchedule as generateScheduleLogic } from '../utils/scheduleLogic';
import { exportScheduleToPDF } from '../utils/pdfGenerator';

// O componente agora recebe '{ user }' como uma propriedade (prop).
const ScheduleGenerator = ({ user }) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [generatedSchedule, setGeneratedSchedule] = useState([]);
  const [organists, setOrganists] = useState([]);
  const [isLoadingOrganists, setIsLoadingOrganists] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [savedSchedules, setSavedSchedules] = useState([]);
  const [isLoadingSavedSchedules, setIsLoadingSavedSchedules] = useState(false);

  const clearMessages = useCallback(() => { setError(''); setSuccessMessage(''); }, []);

  const fetchOrganistsData = useCallback(async () => {
    if (!user) return; // Não faz nada se não houver usuário.
    setIsLoadingOrganists(true);
    try {
      // Passa o ID do usuário para buscar as organistas dele.
      const orgs = await getOrganists(user.uid);
      setOrganists(orgs);
    } catch (err) {
      setError("Falha ao carregar organistas para geração da escala.");
      console.error("Erro em fetchOrganistsData:", err);
    }
    setIsLoadingOrganists(false);
  }, [user]); // Adiciona 'user' como dependência.

  const loadSavedSchedules = useCallback(async () => {
    if (!user) return;
    setIsLoadingSavedSchedules(true);
    try {
      // Passa o ID do usuário para buscar as escalas dele.
      const schedulesData = await getRecentSchedules(user.uid, 3);
      setSavedSchedules(schedulesData);
    } catch (err) {
      setError("Falha ao carregar escalas salvas.");
      console.error("Erro em loadSavedSchedules:", err);
    }
    setIsLoadingSavedSchedules(false);
  }, [user]); // Adiciona 'user' como dependência.


  useEffect(() => {
    fetchOrganistsData();
    loadSavedSchedules();
  }, [fetchOrganistsData, loadSavedSchedules]);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(''), 4000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const handleGenerateSchedule = async () => {
    clearMessages();
    setGeneratedSchedule([]);
    if (!user) {
        setError("Você precisa estar logado para gerar uma escala.");
        return;
    }
    if (!startDate || !endDate) {
      setError("Por favor, selecione o período completo.");
      return;
    }
    if (organists.length === 0) {
      setError("Nenhum organista cadastrado para este usuário. Cadastre primeiro.");
      return;
    }
    
    setIsGenerating(true);
    try {
      // A lógica usa a lista de organistas que já foi buscada para o usuário correto.
      const schedule = generateScheduleLogic(organists, startDate, endDate);
      setGeneratedSchedule(schedule);

      if (schedule.length > 0) {
        const scheduleId = `escala_${startDate.replace(/-/g, '')}_ate_${endDate.replace(/-/g, '')}_${Date.now()}`;
        const scheduleToSave = {
          period: { start: startDate, end: endDate },
          generatedAt: new Date().toISOString(),
          data: schedule,
          organistCountOnGeneration: organists.length
        };
        // Passa o ID do usuário para salvar a escala no local correto.
        await saveSchedule(user.uid, scheduleId, scheduleToSave);
        setSuccessMessage("Escala gerada e salva com sucesso!");
        await loadSavedSchedules();
      } else {
        setError("Nenhuma escala pôde ser gerada. Verifique as disponibilidades.");
      }
    } catch (err) {
      setError(`Erro ao gerar ou salvar a escala: ${err.message || "Erro desconhecido"}`);
      console.error("Erro em handleGenerateSchedule:", err);
    }
    setIsGenerating(false);
  };

  const handleExportPDF = () => {
    if (generatedSchedule.length === 0) {
      setError("Gere uma escala primeiro para exportar.");
      return;
    }
    exportScheduleToPDF(generatedSchedule, startDate, endDate);
  };

  const handleViewSavedSchedule = (scheduleData) => {
    clearMessages();
    setGeneratedSchedule(scheduleData.data);
    if (scheduleData.period) {
        setStartDate(scheduleData.period.start);
        setEndDate(scheduleData.period.end);
    }
    setSuccessMessage(`Visualizando escala salva.`);
  };


  if (isLoadingOrganists) {
    return <div style={{ padding: '20px', textAlign: 'center' }}>Carregando dados...</div>;
  }

  return (
    <div style={{ padding: '20px', maxWidth: '900px', margin: 'auto' }}>
      <section>
        <h2>Gerar Nova Escala</h2>
        {organists.length === 0 && !isLoadingOrganists && (
          <p style={{ color: 'orange', border: '1px solid orange', padding: '10px', borderRadius: '4px' }}>
            Atenção: Nenhum organista cadastrado para sua conta. Vá para "Cadastro de Organistas" para adicionar.
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
            <button onClick={handleExportPDF} style={{ padding: '8px 12px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }} disabled={isGenerating}>
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
              </ul>
            </div>
          ))}
        </section>
      )}
      
      <section style={{ marginTop: '40px', borderTop: '2px solid #007bff', paddingTop: '20px' }}>
        <h2>Últimas 3 Escalas Salvas</h2>
        {isLoadingSavedSchedules && <p>Carregando escalas salvas...</p>}
        {!isLoadingSavedSchedules && savedSchedules.length === 0 && <p>Nenhuma escala salva encontrada para sua conta.</p>}
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
      </section>
    </div>
  );
};

export default ScheduleGenerator;