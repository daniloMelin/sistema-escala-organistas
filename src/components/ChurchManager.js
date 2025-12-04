import React, { useState, useEffect, useCallback } from 'react';
import { getChurches, addChurch, deleteChurchWithSubcollections, updateChurch } from '../services/firebaseService';
import { useNavigate } from 'react-router-dom';
import { useChurch } from '../contexts/ChurchContext';
import { SERVICE_TEMPLATES } from '../utils/scheduleLogic';

const ChurchManager = ({ user }) => {
  const [churches, setChurches] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Estados do formulário
  const [churchName, setChurchName] = useState('');
  const [churchCode, setChurchCode] = useState('');

  // CONFIGURAÇÃO DOS DIAS DE CULTO
  const [selectedDays, setSelectedDays] = useState({
    sunday_rjm: false,
    sunday_culto: false,
    monday: false,
    tuesday: false,
    wednesday: false,
    thursday: false,
    friday: false,
    saturday: false
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const navigate = useNavigate();
  const { setSelectedChurch } = useChurch();

  // Opções de checkbox para a tela
  const daysOptions = [
    { key: 'sunday_rjm', label: 'Domingo (RJM)' },
    { key: 'sunday_culto', label: 'Domingo (Culto)' },
    { key: 'monday', label: 'Segunda' },
    { key: 'tuesday', label: 'Terça' },
    { key: 'wednesday', label: 'Quarta' },
    { key: 'thursday', label: 'Quinta' },
    { key: 'friday', label: 'Sexta' },
    { key: 'saturday', label: 'Sábado' },
  ];

  const fetchChurches = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const userChurches = await getChurches(user.uid);
      setChurches(userChurches);
    } catch (err) {
      setError('Falha ao carregar as igrejas.');
    }
    setIsLoading(false);
  }, [user]);

  useEffect(() => {
    fetchChurches();
  }, [fetchChurches]);

  // --- LÓGICA INTELIGENTE: Transforma os checkboxes na estrutura que o robô entende ---
  const buildConfig = () => {
    const config = {};

    // Função auxiliar para adicionar serviços a um dia
    const addServicesToDay = (dayKey, servicesToAdd) => {
      if (!config[dayKey]) config[dayKey] = [];
      config[dayKey].push(...servicesToAdd);
    };

    // 1. Processa o Domingo (que pode ter 2 checkboxes diferentes)
    if (selectedDays.sunday_rjm) {
      addServicesToDay('sunday', [SERVICE_TEMPLATES.RJM]);
    }
    if (selectedDays.sunday_culto) {
      addServicesToDay('sunday', [SERVICE_TEMPLATES.MeiaHora, SERVICE_TEMPLATES.Culto]);
    }

    // 2. Processa os outros dias (Segunda a Sábado)
    const weekDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    weekDays.forEach(day => {
      if (selectedDays[day]) {
        addServicesToDay(day, [SERVICE_TEMPLATES.MeiaHora, SERVICE_TEMPLATES.Culto]);
      }
    });

    return config;
  };

  const handleStartEdit = (e, church) => {
    e.stopPropagation();
    setChurchName(church.name);
    setChurchCode(church.code || '');
    setEditingId(church.id);

    // Reconstrói os checkboxes baseados no que está salvo no banco
    if (church.config) {
      const newSelection = {
        sunday_rjm: false, sunday_culto: false,
        monday: false, tuesday: false, wednesday: false,
        thursday: false, friday: false, saturday: false
      };

      Object.keys(church.config).forEach(dayKey => {
        const services = church.config[dayKey];

        if (dayKey === 'sunday') {
          // Se tem RJM na lista de serviços, marca o checkbox
          if (services.some(s => s.id === 'RJM')) newSelection.sunday_rjm = true;
          // Se tem Culto na lista, marca o checkbox
          if (services.some(s => s.id === 'Culto')) newSelection.sunday_culto = true;
        } else {
          // Dias normais
          if (newSelection.hasOwnProperty(dayKey)) {
            newSelection[dayKey] = true;
          }
        }
      });
      setSelectedDays(newSelection);
    }

    setError('');
    setSuccessMessage('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setChurchName('');
    setChurchCode('');
    setEditingId(null);
    // Reseta para o padrão
    setSelectedDays({
      sunday_rjm: false, sunday_culto: false,
      monday: false, tuesday: false, wednesday: false,
      thursday: false, friday: false, saturday: false
    });
    setError('');
    setSuccessMessage('');
  };

  const handleDayChange = (key) => {
    setSelectedDays(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!churchName) { setError('Nome obrigatório.'); return; }

    setIsSubmitting(true);
    setError('');
    setSuccessMessage('');

    try {
      const churchData = {
        name: churchName,
        code: churchCode,
        config: buildConfig() // Gera a configuração estruturada
      };

      if (editingId) {
        await updateChurch(user.uid, editingId, churchData);
        setSuccessMessage('Igreja atualizada!');
      } else {
        await addChurch(user.uid, churchData);
        setSuccessMessage('Igreja criada!');
      }
      handleCancelEdit();
      await fetchChurches();
    } catch (err) {
      setError('Erro ao salvar.');
      console.error(err);
    }
    setIsSubmitting(false);
  };

  const handleDeleteChurch = async (e, churchId, churchName) => {
    e.stopPropagation();
    if (window.confirm(`Tem certeza que deseja excluir a igreja "${churchName}"? \n\nATENÇÃO: Todas as organistas e escalas desta igreja serão perdidas para sempre.`)) {
      try {
        await deleteChurchWithSubcollections(user.uid, churchId);
        setSuccessMessage('Igreja e dados associados excluídos com sucesso.');
        if (editingId === churchId) handleCancelEdit();
        fetchChurches();
      } catch (err) {
        console.error(err);
        alert('Erro ao excluir igreja. Tente novamente.');
      }
    }
  };

  const handleChurchSelect = (church) => {
    setSelectedChurch(church);
    navigate(`/igreja/${church.id}`);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: 'auto' }}>
      <h2>Gerenciamento de Igrejas</h2>

      <div style={{ marginBottom: '30px', padding: '20px', border: '1px solid #ccc', borderRadius: '8px', background: editingId ? '#fff3cd' : '#fff' }}>
        <h3 style={{ marginTop: 0 }}>{editingId ? 'Editar Igreja' : 'Cadastrar Nova Igreja'}</h3>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '10px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Nome da Congregação:</label>
            <input type="text" value={churchName} onChange={(e) => setChurchName(e.target.value)} style={{ width: '100%', padding: '8px', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ccc' }} required />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Código (opcional):</label>
            <input type="text" value={churchCode} onChange={(e) => setChurchCode(e.target.value)} style={{ width: '100%', padding: '8px', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ccc' }} />
          </div>

          {/* SELEÇÃO DE DIAS */}
          <div style={{ marginBottom: '20px', background: '#f9f9f9', padding: '15px', borderRadius: '4px', border: '1px solid #eee' }}>
            <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '10px' }}>Dias de Culto:</label>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '10px' }}>
              {daysOptions.map(day => (
                <div key={day.key} style={{ display: 'flex', alignItems: 'center', background: 'white', padding: '5px', borderRadius: '4px', border: '1px solid #e0e0e0' }}>
                  <input
                    type="checkbox"
                    id={`day-${day.key}`}
                    checked={selectedDays[day.key]}
                    onChange={() => handleDayChange(day.key)}
                    style={{ cursor: 'pointer' }}
                  />
                  <label htmlFor={`day-${day.key}`} style={{ marginLeft: '6px', cursor: 'pointer', fontSize: '0.9em' }}>
                    {day.label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button type="submit" disabled={isSubmitting} style={{ padding: '10px 20px', backgroundColor: editingId ? '#ffc107' : '#007bff', color: editingId ? '#000' : 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
              {isSubmitting ? 'Salvando...' : (editingId ? 'Atualizar' : 'Cadastrar')}
            </button>
            {editingId && <button type="button" onClick={handleCancelEdit} style={{ padding: '10px 15px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Cancelar</button>}
          </div>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
        </form>
      </div>

      <h3>Igrejas Cadastradas:</h3>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {churches.map(church => (
          <li key={church.id} onClick={() => handleChurchSelect(church)} style={{ border: '1px solid #eee', padding: '15px', marginBottom: '10px', borderRadius: '4px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'white', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
            <div>
              <strong style={{ fontSize: '1.1em', color: '#0056b3' }}>{church.name}</strong>
              <br />
              {church.code && <small style={{ color: '#666' }}>Código: {church.code}</small>}
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={(e) => handleStartEdit(e, church)} style={{ backgroundColor: '#ffc107', color: '#333', padding: '6px 12px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Editar</button>
              <button onClick={(e) => handleDeleteChurch(e, church.id, church.name)} style={{ backgroundColor: '#dc3545', color: 'white', padding: '6px 12px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Excluir</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
export default ChurchManager;