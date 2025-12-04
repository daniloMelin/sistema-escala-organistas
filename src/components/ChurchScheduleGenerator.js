import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getOrganistsByChurch, saveScheduleToChurch, getChurchSchedules, getChurch } from '../services/firebaseService';
import { generateSchedule as generateScheduleLogic } from '../utils/scheduleLogic';
import { exportScheduleToPDF } from '../utils/pdfGenerator';
import { useChurch } from '../contexts/ChurchContext';

// Função auxiliar para agrupar dias por mês (Mesma lógica do PDF)
const getMonthYearLabel = (dateStr) => {
  if (!dateStr) return '';
  const parts = dateStr.split('/');
  const monthIndex = parseInt(parts[1], 10) - 1;
  const year = parts[2];
  const months = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];
  return `${months[monthIndex]} de ${year}`;
};

const ChurchScheduleGenerator = ({ user }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { selectedChurch } = useChurch();

  // Estados
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [organists, setOrganists] = useState([]);

  const [generatedSchedule, setGeneratedSchedule] = useState([]);
  const [savedSchedules, setSavedSchedules] = useState([]);

  const [currentScheduleId, setCurrentScheduleId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [churchConfig, setChurchConfig] = useState(null);

  const loadData = useCallback(async () => {
    if (!user || !id) return;
    setIsLoading(true);
    try {
      const orgsData = await getOrganistsByChurch(user.uid, id);
      setOrganists(orgsData);

      // Buscar dados completos da igreja incluindo a config
      const churchData = await getChurch(user.uid, id);
      if (churchData && churchData.config) {
        setChurchConfig(churchData.config);
      }

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



  // --- EXPORTAR PDF ---
  const handleExportClick = () => {
    const churchName = selectedChurch?.name || "Igreja";
    try {
      exportScheduleToPDF(generatedSchedule, startDate, endDate, churchName);
    } catch (err) {
      console.error(err);
      setError(`Erro ao exportar PDF: ${err.message || err}`);
    }
  };

  // --- GERAR NOVA ESCALA ---
  const handleGenerate = async () => {
    setError('');
    setSuccessMessage('');
    setIsEditing(false);

    if (!startDate || !endDate) {
      setError("Defina as datas de início e fim.");
      return;
    }
    if (organists.length === 0) {
      setError("Não há organistas cadastradas nesta igreja. Volte e cadastre.");
      return;
    }

    if (!churchConfig || Object.keys(churchConfig).length === 0) {
      setError("A igreja não tem dias de culto configurados. Volte e configure os dias de culto.");
      return;
    }

    setIsGenerating(true);
    try {
      const schedule = generateScheduleLogic(organists, startDate, endDate, churchConfig);

      if (schedule.length === 0) {
        setError("Não foi possível gerar escala.");
        console.error('[ERROR] Schedule is empty!');
        setIsGenerating(false);
        return;
      }

      setGeneratedSchedule(schedule);

      const scheduleId = `escala_${startDate}_${endDate}_${Date.now()}`;
      const scheduleData = {
        period: { start: startDate, end: endDate },
        generatedAt: new Date().toISOString(),
        data: schedule,
        organistCount: organists.length
      };

      await saveScheduleToChurch(user.uid, id, scheduleId, scheduleData);

      setCurrentScheduleId(scheduleId);
      setSuccessMessage("Escala gerada e salva com sucesso!");

      const updatedSchedules = await getChurchSchedules(user.uid, id);
      setSavedSchedules(updatedSchedules);

    } catch (err) {
      console.error(err);
      setError("Erro ao gerar/salvar escala.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleViewSaved = (scheduleData) => {
    setError('');
    setSuccessMessage('');
    setIsEditing(false);

    setGeneratedSchedule(scheduleData.data);
    if (scheduleData.period) {
      setStartDate(scheduleData.period.start);
      setEndDate(scheduleData.period.end);
    }
    setCurrentScheduleId(scheduleData.id);
    setSuccessMessage("Visualizando escala do histórico.");
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAssignmentChange = (originalIndex, cultoKey, newName) => {
    const updatedSchedule = [...generatedSchedule];
    updatedSchedule[originalIndex].assignments[cultoKey] = newName;
    setGeneratedSchedule(updatedSchedule);
  };

  const handleSaveChanges = async () => {
    if (!currentScheduleId) return;

    setIsGenerating(true);
    try {
      const scheduleData = {
        period: { start: startDate, end: endDate },
        generatedAt: new Date().toISOString(),
        data: generatedSchedule,
        organistCount: organists.length
      };

      await saveScheduleToChurch(user.uid, id, currentScheduleId, scheduleData);
      setSuccessMessage("Alterações salvas com sucesso!");
      setIsEditing(false);

      const updatedSchedules = await getChurchSchedules(user.uid, id);
      setSavedSchedules(updatedSchedules);
    } catch (err) {
      console.error(err);
      setError("Erro ao salvar as alterações.");
    } finally {
      setIsGenerating(false);
    }
  };

  // --- AGRUPAMENTO PARA EXIBIÇÃO ---
  // Precisamos manter o índice original para a edição funcionar
  const groupedSchedule = generatedSchedule.reduce((acc, day, index) => {
    // Adicionamos o índice original ao objeto do dia
    const dayWithIndex = { ...day, originalIndex: index };
    const monthKey = getMonthYearLabel(day.date);

    if (!acc[monthKey]) acc[monthKey] = [];
    acc[monthKey].push(dayWithIndex);
    return acc;
  }, {});


  return (
    <div style={{ padding: '20px', maxWidth: '1100px', margin: 'auto' }}>
      <button onClick={() => navigate(`/igreja/${id}`)} style={{ marginBottom: '20px', cursor: 'pointer' }}>
        &larr; Voltar para Painel
      </button>

      <h2 style={{ borderBottom: '2px solid #eee', paddingBottom: '10px' }}>
        Gerador de Escala: <span style={{ color: '#0056b3' }}>{selectedChurch?.name || 'Igreja'}</span>
      </h2>

      {!isEditing && (
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
                padding: '10px 20px', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px',
                cursor: isGenerating ? 'wait' : 'pointer', fontWeight: 'bold'
              }}
            >
              {isGenerating ? 'Gerando...' : 'Gerar Nova Escala'}
            </button>
          </div>

          {error && <p style={{ color: 'red', marginTop: '10px', background: '#ffd2d2', padding: '10px', borderRadius: '4px' }}>{error}</p>}
          {successMessage && <p style={{ color: 'green', marginTop: '10px', background: '#d4edda', padding: '10px', borderRadius: '4px' }}>{successMessage}</p>}
        </div>
      )}

      {/* --- VISUALIZAÇÃO EM GRADE --- */}
      {generatedSchedule.length > 0 && (
        <div style={{ marginBottom: '40px' }}>

          {/* BARRA DE FERRAMENTAS */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', background: '#eee', padding: '10px', borderRadius: '4px' }}>
            <h3 style={{ margin: 0 }}>
              {isEditing ? '✏️ Editando Escala' : 'Visualização da Escala'}
            </h3>

            <div style={{ display: 'flex', gap: '10px' }}>
              {isEditing ? (
                <>
                  <button onClick={() => setIsEditing(false)} style={{ background: '#6c757d', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '4px', cursor: 'pointer' }}>Cancelar</button>
                  <button onClick={handleSaveChanges} disabled={isGenerating} style={{ background: '#28a745', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                    {isGenerating ? 'Salvando...' : 'Salvar Alterações'}
                  </button>
                </>
              ) : (
                <>
                  <button onClick={() => setIsEditing(true)} style={{ background: '#ffc107', color: '#333', border: 'none', padding: '8px 15px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                    ✏️ Editar Manualmente
                  </button>
                  <button onClick={handleExportClick} style={{ background: '#17a2b8', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                    📥 Baixar PDF
                  </button>
                </>
              )}
            </div>
          </div>

          {/* ÁREA DA GRADE (LOOP POR MÊS) */}
          {Object.entries(groupedSchedule).map(([monthLabel, days]) => (
            <div key={monthLabel} style={{ marginBottom: '30px' }}>
              {/* Cabeçalho do Mês */}
              <div style={{ background: '#e0e0e0', padding: '8px', textAlign: 'center', fontWeight: 'bold', borderRadius: '4px', marginBottom: '10px', color: '#555' }}>
                {monthLabel.toUpperCase()}
              </div>

              {/* Grid CSS - 3 Colunas (responsivo) */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', // Tenta fazer 3 colunas, mas ajusta se tela for pequena
                gap: '15px'
              }}>
                {days.map((day) => {
                  // Verifica se tem algo válido para mostrar (opcional, igual no PDF)
                  const hasAssignments = Object.values(day.assignments).some(v => v && v !== 'VAGO');
                  if (!hasAssignments && !isEditing) return null; // Esconde dias vazios se não estiver editando

                  return (
                    <div key={day.date} style={{
                      border: '1px solid #ccc',
                      borderRadius: '6px',
                      overflow: 'hidden',
                      boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
                      background: 'white'
                    }}>
                      {/* Cabeçalho do Cartão (Data) */}
                      <div style={{ background: '#f0f0f0', padding: '8px', textAlign: 'center', fontWeight: 'bold', borderBottom: '1px solid #eee' }}>
                        {day.dayName}, {day.date}
                      </div>

                      {/* Conteúdo do Cartão */}
                      <div style={{ padding: '15px' }}>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                          {Object.entries(day.assignments).map(([culto, nome]) => (
                            <li key={culto} style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.95em' }}>
                              <span style={{ color: '#666', fontWeight: 'bold' }}>{culto}:</span>

                              {isEditing ? (
                                <select
                                  value={nome}
                                  onChange={(e) => handleAssignmentChange(day.originalIndex, culto, e.target.value)}
                                  style={{ padding: '4px', borderRadius: '4px', borderColor: '#ccc', maxWidth: '150px' }}
                                >
                                  <option value="VAGO">VAGO</option>
                                  {organists.map(org => (
                                    <option key={org.id} value={org.name}>{org.name}</option>
                                  ))}
                                </select>
                              ) : (
                                <span style={{ color: nome === 'VAGO' ? 'red' : '#333', fontWeight: nome === 'VAGO' ? 'bold' : 'normal' }}>
                                  {nome}
                                </span>
                              )}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

        </div>
      )}

      {/* --- HISTÓRICO --- */}
      {!isEditing && (
        <>
          <h3 style={{ marginTop: '40px', borderTop: '2px solid #eee', paddingTop: '20px' }}>Histórico de Escalas</h3>
          {savedSchedules.length === 0 && <p style={{ color: '#777' }}>Nenhuma escala salva ainda.</p>}
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {savedSchedules.map(sch => (
              <li key={sch.id} style={{ border: '1px solid #eee', padding: '15px', marginBottom: '10px', borderRadius: '4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'white' }}>
                <div>
                  <strong>{new Date(sch.period.start + "T00:00:00").toLocaleDateString()} até {new Date(sch.period.end + "T00:00:00").toLocaleDateString()}</strong>
                  <br />
                  <small style={{ color: '#999' }}>Atualizada em: {new Date(sch.generatedAt).toLocaleString()}</small>
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
        </>
      )}
    </div>
  );
};

export default ChurchScheduleGenerator;