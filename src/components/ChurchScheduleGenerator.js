import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getOrganistsByChurch, saveScheduleToChurch, getChurchSchedules } from '../services/firebaseService';
import { generateSchedule as generateScheduleLogic } from '../utils/scheduleLogic';
import { exportScheduleToPDF } from '../utils/pdfGenerator';
import { useChurch } from '../contexts/ChurchContext';

const ChurchScheduleGenerator = ({ user }) => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const { selectedChurch } = useChurch();

  // Estados de Dados
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [organists, setOrganists] = useState([]);
  
  const [generatedSchedule, setGeneratedSchedule] = useState([]);
  const [savedSchedules, setSavedSchedules] = useState([]);
  
  // Estados de Controle
  const [currentScheduleId, setCurrentScheduleId] = useState(null); // ID da escala atual (para saber qual atualizar)
  const [isEditing, setIsEditing] = useState(false); // Controla se estamos editando
  
  // Estados de Feedback
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const loadData = useCallback(async () => {
    if (!user || !id) return;
    setIsLoading(true);
    try {
      const orgsData = await getOrganistsByChurch(user.uid, id);
      setOrganists(orgsData);

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

    setIsGenerating(true);
    try {
      const schedule = generateScheduleLogic(organists, startDate, endDate);
      
      if (schedule.length === 0) {
        setError("Não foi possível gerar escala (verifique as datas e disponibilidades).");
        setIsGenerating(false);
        return;
      }

      setGeneratedSchedule(schedule);

      // Salva no Firestore
      const scheduleId = `escala_${startDate}_${endDate}_${Date.now()}`;
      const scheduleData = {
        period: { start: startDate, end: endDate },
        generatedAt: new Date().toISOString(),
        data: schedule,
        organistCount: organists.length
      };

      await saveScheduleToChurch(user.uid, id, scheduleId, scheduleData);
      
      setCurrentScheduleId(scheduleId); // Guarda o ID da nova escala
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

  // --- VISUALIZAR HISTÓRICO ---
  const handleViewSaved = (scheduleData) => {
    setError('');
    setSuccessMessage('');
    setIsEditing(false); // Garante que começa sem editar

    setGeneratedSchedule(scheduleData.data);
    if (scheduleData.period) {
        setStartDate(scheduleData.period.start);
        setEndDate(scheduleData.period.end);
    }
    setCurrentScheduleId(scheduleData.id); // Guarda o ID da escala carregada
    
    setSuccessMessage("Visualizando escala do histórico.");
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // --- LÓGICA DE EDIÇÃO MANUAL ---
  
  // Altera uma organista específica na escala
  const handleAssignmentChange = (dayIndex, cultoKey, newName) => {
    const updatedSchedule = [...generatedSchedule];
    updatedSchedule[dayIndex].assignments[cultoKey] = newName;
    setGeneratedSchedule(updatedSchedule);
  };

  // Salva as edições no banco
  const handleSaveChanges = async () => {
    if (!currentScheduleId) {
        setError("Erro: Nenhuma escala identificada para salvar.");
        return;
    }
    
    setIsGenerating(true); // Reusa o estado de loading
    try {
        const scheduleData = {
            period: { start: startDate, end: endDate },
            generatedAt: new Date().toISOString(), // Atualiza a data de modificação
            data: generatedSchedule,
            organistCount: organists.length
        };

        await saveScheduleToChurch(user.uid, id, currentScheduleId, scheduleData);
        
        setSuccessMessage("Alterações salvas com sucesso!");
        setIsEditing(false); // Sai do modo de edição
        
        // Atualiza a lista do histórico para refletir a nova data/hora
        const updatedSchedules = await getChurchSchedules(user.uid, id);
        setSavedSchedules(updatedSchedules);

    } catch (err) {
        console.error(err);
        setError("Erro ao salvar as alterações.");
    } finally {
        setIsGenerating(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '900px', margin: 'auto' }}>
      <button onClick={() => navigate(`/igreja/${id}`)} style={{ marginBottom: '20px', cursor: 'pointer' }}>
        &larr; Voltar para Painel
      </button>

      <h2 style={{ borderBottom: '2px solid #eee', paddingBottom: '10px' }}>
        Gerador de Escala: <span style={{ color: '#0056b3' }}>{selectedChurch?.name || 'Igreja'}</span>
      </h2>

      {/* --- CONTROLES (Esconde se estiver editando para focar na edição) --- */}
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
                padding: '10px 20px', 
                background: '#007bff', 
                color: 'white', 
                border: 'none', 
                borderRadius: '4px', 
                cursor: isGenerating ? 'wait' : 'pointer',
                fontWeight: 'bold'
                }}
            >
                {isGenerating ? 'Gerando...' : 'Gerar Nova Escala'}
            </button>
            </div>
            
            {error && <p style={{ color: 'red', marginTop: '10px', background: '#ffd2d2', padding: '10px', borderRadius: '4px' }}>{error}</p>}
            {successMessage && <p style={{ color: 'green', marginTop: '10px', background: '#d4edda', padding: '10px', borderRadius: '4px' }}>{successMessage}</p>}
        </div>
      )}

      {/* --- VISUALIZAÇÃO / EDIÇÃO DA ESCALA --- */}
      {generatedSchedule.length > 0 && (
        <div style={{ marginBottom: '40px' }}>
          
          {/* BARRA DE FERRAMENTAS DA ESCALA */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', background: '#eee', padding: '10px', borderRadius: '4px' }}>
            <h3 style={{ margin: 0 }}>
                {isEditing ? '✏️ Editando Escala' : 'Visualização da Escala'}
            </h3>
            
            <div style={{ display: 'flex', gap: '10px' }}>
                {isEditing ? (
                    <>
                        <button 
                            onClick={() => setIsEditing(false)}
                            style={{ background: '#6c757d', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '4px', cursor: 'pointer' }}
                        >
                            Cancelar
                        </button>
                        <button 
                            onClick={handleSaveChanges}
                            disabled={isGenerating}
                            style={{ background: '#28a745', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                        >
                            {isGenerating ? 'Salvando...' : 'Salvar Alterações'}
                        </button>
                    </>
                ) : (
                    <>
                        <button 
                            onClick={() => setIsEditing(true)}
                            style={{ background: '#ffc107', color: '#333', border: 'none', padding: '8px 15px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                        >
                            ✏️ Editar Manualmente
                        </button>
                        <button 
                            onClick={() => exportScheduleToPDF(generatedSchedule, startDate, endDate)}
                            style={{ background: '#17a2b8', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                        >
                            📥 Baixar PDF
                        </button>
                    </>
                )}
            </div>
          </div>

          {/* LISTA DE DIAS */}
          <div style={{ border: '1px solid #eee', borderRadius: '4px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            {generatedSchedule.map((day, dayIdx) => (
               <div key={dayIdx} style={{ padding: '15px', borderBottom: '1px solid #eee', background: dayIdx % 2 === 0 ? '#fff' : '#fcfcfc' }}>
                 <strong style={{ fontSize: '1.1em', color: '#333' }}>{day.dayName}, {day.date}</strong>
                 
                 <ul style={{ margin: '10px 0 0 20px', color: '#555' }}>
                    {Object.entries(day.assignments).map(([culto, nome]) => (
                        <li key={culto} style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span style={{ fontWeight: '500', minWidth: '120px' }}>{culto}:</span> 
                            
                            {isEditing ? (
                                // --- DROPDOWN PARA EDIÇÃO ---
                                <select 
                                    value={nome} 
                                    onChange={(e) => handleAssignmentChange(dayIdx, culto, e.target.value)}
                                    style={{ padding: '5px', borderRadius: '4px', borderColor: '#ccc' }}
                                >
                                    <option value="VAGO">VAGO</option>
                                    {organists.map(org => (
                                        <option key={org.id} value={org.name}>{org.name}</option>
                                    ))}
                                </select>
                            ) : (
                                // --- TEXTO NORMAL ---
                                <>
                                    {nome === 'VAGO' ? <span style={{color: 'red', fontWeight: 'bold'}}>VAGO</span> : <b>{nome}</b>}
                                </>
                            )}
                        </li>
                    ))}
                 </ul>
               </div>
            ))}
          </div>
        </div>
      )}

      {/* --- HISTÓRICO --- */}
      {!isEditing && (
          <>
            <h3 style={{ marginTop: '40px', borderTop: '2px solid #eee', paddingTop: '20px' }}>Histórico de Escalas</h3>
            {isLoading && <p>Carregando histórico...</p>}
            {!isLoading && savedSchedules.length === 0 && <p style={{ color: '#777' }}>Nenhuma escala salva para esta igreja ainda.</p>}
            
            <ul style={{ listStyle: 'none', padding: 0 }}>
                {savedSchedules.map(sch => (
                    <li key={sch.id} style={{ border: '1px solid #eee', padding: '15px', marginBottom: '10px', borderRadius: '4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'white' }}>
                        <div>
                            <strong>{new Date(sch.period.start + "T00:00:00").toLocaleDateString()} até {new Date(sch.period.end + "T00:00:00").toLocaleDateString()}</strong>
                            <br/>
                            <small style={{ color: '#999' }}>Atualizada em: {new Date(sch.generatedAt).toLocaleString()}</small>
                        </div>
                        <button 
                            onClick={() => handleViewSaved(sch)} 
                            style={{ cursor: 'pointer', padding: '8px 15px', background: '#6c757d', color: 'white', border: 'none', borderRadius: '4px' }}
                        >
                            Visualizar / Editar
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