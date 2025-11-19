import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
// Importa as novas funções de serviço focadas na igreja
import { getOrganistsByChurch, saveScheduleToChurch, getChurchSchedules } from '../services/firebaseService';
import { generateSchedule as generateScheduleLogic } from '../utils/scheduleLogic';
import { exportScheduleToPDF } from '../utils/pdfGenerator';
import { useChurch } from '../contexts/ChurchContext';

const ChurchScheduleGenerator = ({ user }) => {
  const { id } = useParams(); // ID da Igreja vindo da URL
  const navigate = useNavigate();
  const { selectedChurch } = useChurch(); // Nome da igreja para exibir no título

  // Estados
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [organists, setOrganists] = useState([]);
  const [generatedSchedule, setGeneratedSchedule] = useState([]);
  const [savedSchedules, setSavedSchedules] = useState([]);
  
  // Estados de Loading/Feedback
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Carregar Organistas e Escalas Antigas ao entrar
  const loadData = useCallback(async () => {
    if (!user || !id) return;
    setIsLoading(true);
    try {
      // 1. Busca Organistas da Igreja
      const orgsData = await getOrganistsByChurch(user.uid, id);
      setOrganists(orgsData);

      // 2. Busca Histórico de Escalas da Igreja
      const schedulesData = await getChurchSchedules(user.uid, id);
      setSavedSchedules(schedulesData);
    } catch (err) {
      console.error(err);
      setError("Erro ao carregar dados da igreja.");
    } finally {
      setIsLoading(false);
    }
  }, [user, id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Função Principal: GERAR ESCALA
  const handleGenerate = async () => {
    setError('');
    setSuccessMessage('');
    
    if (!startDate || !endDate) {
      setError("Defina as datas de início e fim.");
      return;
    }
    if (organists.length === 0) {
      setError("Não há organistas cadastradas nesta igreja. Volte e cadastre.");
      return;
    }

    setIsGenerating(true);
    try {
      // 1. Gera a lógica (Algoritmo puro)
      const schedule = generateScheduleLogic(organists, startDate, endDate);
      
      if (schedule.length === 0) {
        setError("Não foi possível gerar escala (verifique as datas e disponibilidades).");
        setIsGenerating(false);
        return;
      }

      setGeneratedSchedule(schedule);

      // 2. Salva no Firestore (Na pasta da Igreja)
      const scheduleId = `escala_${startDate}_${endDate}_${Date.now()}`;
      const scheduleData = {
        period: { start: startDate, end: endDate },
        generatedAt: new Date().toISOString(),
        data: schedule,
        organistCount: organists.length
      };

      await saveScheduleToChurch(user.uid, id, scheduleId, scheduleData);
      
      setSuccessMessage("Escala gerada e salva com sucesso!");
      // Recarrega o histórico
      const updatedSchedules = await getChurchSchedules(user.uid, id);
      setSavedSchedules(updatedSchedules);

    } catch (err) {
      console.error(err);
      setError("Erro ao gerar/salvar escala.");
    } finally {
      setIsGenerating(false);
    }
  };

  // Visualizar uma escala do histórico
  const handleViewSaved = (scheduleData) => {
    setGeneratedSchedule(scheduleData.data);
    if (scheduleData.period) {
        setStartDate(scheduleData.period.start);
        setEndDate(scheduleData.period.end);
    }
    setSuccessMessage("Visualizando escala do histórico.");
    // Rola a página para cima para ver a escala
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div style={{ padding: '20px', maxWidth: '900px', margin: 'auto' }}>
      <button onClick={() => navigate(`/igreja/${id}`)} style={{ marginBottom: '20px', cursor: 'pointer' }}>
        &larr; Voltar para Painel
      </button>

      <h2 style={{ borderBottom: '2px solid #eee', paddingBottom: '10px' }}>
        Gerador de Escala: <span style={{ color: '#0056b3' }}>{selectedChurch?.name || 'Igreja'}</span>
      </h2>

      {/* --- CONTROLES --- */}
      <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '8px', marginBottom: '30px', border: '1px solid #ddd' }}>
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Data Início:</label>
            <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Data Fim:</label>
            <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
          </div>
          <button 
            onClick={handleGenerate} 
            disabled={isGenerating}
            style={{ 
              padding: '10px 20px', 
              background: '#007bff', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px', 
              cursor: isGenerating ? 'wait' : 'pointer',
              fontWeight: 'bold'
            }}
          >
            {isGenerating ? 'Gerando...' : 'Gerar Escala'}
          </button>
        </div>
        
        {error && <p style={{ color: 'red', marginTop: '10px', background: '#ffd2d2', padding: '10px', borderRadius: '4px' }}>{error}</p>}
        {successMessage && <p style={{ color: 'green', marginTop: '10px', background: '#d4edda', padding: '10px', borderRadius: '4px' }}>{successMessage}</p>}
      </div>

      {/* --- VISUALIZAÇÃO DA ESCALA --- */}
      {generatedSchedule.length > 0 && (
        <div style={{ marginBottom: '40px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <h3>Visualização da Escala</h3>
            <button 
              onClick={() => exportScheduleToPDF(generatedSchedule, startDate, endDate)}
              style={{ background: '#28a745', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
            >
              📥 Baixar PDF
            </button>
          </div>
          <div style={{ border: '1px solid #eee', borderRadius: '4px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            {generatedSchedule.map((day, idx) => (
               <div key={idx} style={{ padding: '15px', borderBottom: '1px solid #eee', background: idx % 2 === 0 ? '#fff' : '#fcfcfc' }}>
                 <strong style={{ fontSize: '1.1em', color: '#333' }}>{day.dayName}, {day.date}</strong>
                 <ul style={{ margin: '10px 0 0 20px', color: '#555' }}>
                    {/* Exibe apenas cultos preenchidos ou VAGO */}
                    {Object.entries(day.assignments).map(([culto, nome]) => (
                        <li key={culto} style={{ marginBottom: '4px' }}>
                            <span style={{ fontWeight: '500' }}>{culto}:</span> {nome === 'VAGO' ? <span style={{color: 'red'}}>VAGO</span> : <b>{nome}</b>}
                        </li>
                    ))}
                 </ul>
               </div>
            ))}
          </div>
        </div>
      )}

      {/* --- HISTÓRICO --- */}
      <h3 style={{ marginTop: '40px', borderTop: '2px solid #eee', paddingTop: '20px' }}>Histórico de Escalas (Desta Igreja)</h3>
      {isLoading && <p>Carregando histórico...</p>}
      {!isLoading && savedSchedules.length === 0 && <p style={{ color: '#777' }}>Nenhuma escala salva para esta igreja ainda.</p>}
      
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {savedSchedules.map(sch => (
            <li key={sch.id} style={{ border: '1px solid #eee', padding: '15px', marginBottom: '10px', borderRadius: '4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'white' }}>
                <div>
                    <strong>{new Date(sch.period.start + "T00:00:00").toLocaleDateString()} até {new Date(sch.period.end + "T00:00:00").toLocaleDateString()}</strong>
                    <br/>
                    <small style={{ color: '#999' }}>Gerada em: {new Date(sch.generatedAt).toLocaleString()}</small>
                </div>
                <button 
                    onClick={() => handleViewSaved(sch)} 
                    style={{ cursor: 'pointer', padding: '8px 15px', background: '#6c757d', color: 'white', border: 'none', borderRadius: '4px' }}
                >
                    Visualizar
                </button>
            </li>
        ))}
      </ul>
    </div>
  );
};

export default ChurchScheduleGenerator;