import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
// Importamos o updateOrganistInChurch agora
import { getOrganistsByChurch, addOrganistToChurch, deleteOrganistFromChurch, updateOrganistInChurch } from '../services/firebaseService';
import { useChurch } from '../contexts/ChurchContext'; 

const WEEK_DAYS = [
  { key: 'sunday', label: 'Domingo' },
  { key: 'monday', label: 'Segunda' },
  { key: 'tuesday', label: 'Terça' },
  { key: 'wednesday', label: 'Quarta' },
  { key: 'thursday', label: 'Quinta' },
  { key: 'friday', label: 'Sexta' },
  { key: 'saturday', label: 'Sábado' },
];

const INITIAL_AVAILABILITY = {
  sunday: false, monday: false, tuesday: false, wednesday: false,
  thursday: false, friday: false, saturday: false,
};

const ChurchDashboard = ({ user }) => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const { selectedChurch } = useChurch(); 
  
  const [organists, setOrganists] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Estados do Formulário
  const [newOrganistName, setNewOrganistName] = useState('');
  const [availability, setAvailability] = useState(INITIAL_AVAILABILITY);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Estado para controlar a EDIÇÃO (se tiver ID aqui, estamos editando)
  const [editingId, setEditingId] = useState(null);

  const fetchOrganists = useCallback(async () => {
    if (!user || !id) return;
    setLoading(true);
    try {
      const data = await getOrganistsByChurch(user.uid, id);
      setOrganists(data);
    } catch (error) {
      console.error("Erro fatal ao carregar organistas:", error);
    } finally {
      setLoading(false);
    }
  }, [user, id]);

  useEffect(() => {
    fetchOrganists();
  }, [fetchOrganists]);

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setAvailability(prev => ({ ...prev, [name]: checked }));
  };

  // Prepara o formulário para edição
  const handleStartEdit = (organist) => {
    setNewOrganistName(organist.name);
    // Garante que carregamos a disponibilidade existente ou o padrão se faltar algo
    setAvailability({ ...INITIAL_AVAILABILITY, ...organist.availability });
    setEditingId(organist.id);
    // Rola a tela para o formulário
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Cancela a edição e limpa o formulário
  const handleCancelEdit = () => {
    setNewOrganistName('');
    setAvailability(INITIAL_AVAILABILITY);
    setEditingId(null);
  };

  const handleSaveOrganist = async (e) => {
    e.preventDefault();
    if (!newOrganistName.trim()) return;

    if (!user || !id) {
        alert("Erro de identificação.");
        return;
    }

    setIsSubmitting(true);
    try {
      if (editingId) {
        // --- MODO ATUALIZAÇÃO ---
        await updateOrganistInChurch(user.uid, id, editingId, {
            name: newOrganistName,
            availability: availability
        });
      } else {
        // --- MODO CRIAÇÃO ---
        await addOrganistToChurch(user.uid, id, {
            name: newOrganistName,
            availability: availability 
        });
      }
      
      // Limpa tudo após salvar
      handleCancelEdit(); 
      await fetchOrganists(); 
      
    } catch (error) {
      console.error("Erro ao salvar:", error);
      alert("Erro ao salvar organista.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteOrganist = async (organistId, organistName) => {
    if (window.confirm(`Tem certeza que deseja excluir a organista ${organistName}?`)) {
      try {
        await deleteOrganistFromChurch(user.uid, id, organistId);
        await fetchOrganists(); 
      } catch (error) {
        console.error(error);
        alert("Erro ao excluir organista.");
      }
    }
  };

  const formatAvailability = (avail) => {
    if (!avail) return "Sem disponibilidade";
    const activeDays = WEEK_DAYS.filter(day => avail[day.key]);
    if (activeDays.length === 0) return "Nenhum dia";
    return activeDays.map(d => d.label.substring(0, 3)).join(', ');
  };

  if (!user) return <div style={{ padding: 20 }}>Carregando...</div>;

  return (
    <div style={{ padding: '20px', maxWidth: '900px', margin: 'auto' }}>
      {/* CABEÇALHO */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <button 
          onClick={() => navigate('/')} 
          style={{ padding: '8px 12px', cursor: 'pointer' }}
        >
          &larr; Voltar para Igrejas
        </button>
        
        <button 
            onClick={() => navigate(`/igreja/${id}/escala`)}
            style={{ 
                backgroundColor: '#007bff', color: 'white', border: 'none', 
                borderRadius: '4px', padding: '10px 20px', cursor: 'pointer',
                fontWeight: 'bold', boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
            }}
        >
            📅 Gerar Escala
        </button>
      </div>

      <div style={{ borderBottom: '2px solid #eee', paddingBottom: '10px', marginBottom: '20px' }}>
        <h2>Painel de Gerenciamento</h2>
        <h3 style={{ color: '#0056b3', margin: '5px 0' }}>
            {selectedChurch ? selectedChurch.name : `Igreja (ID: ${id})`}
        </h3>
      </div>

      {/* --- FORMULÁRIO (INTELIGENTE: CRIA OU EDITA) --- */}
      <div style={{ 
          background: editingId ? '#fff3cd' : '#f8f9fa', // Muda a cor se estiver editando
          padding: '20px', borderRadius: '8px', marginBottom: '30px', 
          border: editingId ? '1px solid #ffeeba' : '1px solid #ddd', 
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)' 
      }}>
        <h4 style={{ marginTop: 0, borderBottom: '1px solid #ccc', paddingBottom: '10px' }}>
            {editingId ? `Editando: ${newOrganistName}` : 'Cadastrar Nova Organista'}
        </h4>
        
        <form onSubmit={handleSaveOrganist}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Nome Completo:</label>
            <input 
              type="text" 
              value={newOrganistName}
              onChange={(e) => setNewOrganistName(e.target.value)}
              required
              disabled={isSubmitting}
              style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Disponibilidade Semanal:</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px' }}>
              {WEEK_DAYS.map(day => (
                <div key={day.key} style={{ display: 'flex', alignItems: 'center', gap: '5px', background: 'white', padding: '5px 10px', borderRadius: '4px', border: '1px solid #eee' }}>
                  <input
                    type="checkbox"
                    id={day.key}
                    name={day.key}
                    checked={availability[day.key]}
                    onChange={handleCheckboxChange}
                    disabled={isSubmitting}
                  />
                  <label htmlFor={day.key} style={{ cursor: 'pointer' }}>{day.label}</label>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
                type="submit" 
                disabled={isSubmitting} 
                style={{ 
                    padding: '10px 25px', 
                    cursor: isSubmitting ? 'wait' : 'pointer',
                    backgroundColor: editingId ? '#ffc107' : '#28a745', // Amarelo se editar, Verde se salvar
                    color: editingId ? '#000' : 'white', 
                    border: 'none', borderRadius: '4px', fontWeight: 'bold', fontSize: '16px', flex: 1
                }}
            >
                {isSubmitting ? 'Salvando...' : (editingId ? 'Atualizar Organista' : 'Cadastrar Organista')}
            </button>
            
            {editingId && (
                <button 
                    type="button"
                    onClick={handleCancelEdit}
                    disabled={isSubmitting}
                    style={{ 
                        padding: '10px 15px', cursor: 'pointer',
                        backgroundColor: '#6c757d', color: 'white', 
                        border: 'none', borderRadius: '4px', fontWeight: 'bold'
                    }}
                >
                    Cancelar
                </button>
            )}
          </div>
        </form>
      </div>

      {/* --- LISTA --- */}
      <h3>Equipe Cadastrada</h3>
      {loading ? (
        <p>Carregando dados...</p>
      ) : organists.length === 0 ? (
        <p>Nenhuma organista cadastrada nesta igreja ainda.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {organists.map((org) => (
            <li key={org.id} style={{ padding: '15px', marginBottom: '10px', border: '1px solid #eee', borderRadius: '6px', background: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                <strong style={{ fontSize: '1.1em', color: '#333' }}>{org.name}</strong>
                
                <div style={{ display: 'flex', gap: '10px' }}>
                    {/* Botão Editar ATIVO */}
                    <button 
                      onClick={() => handleStartEdit(org)}
                      style={{ 
                          fontSize: '0.8em', padding: '6px 10px', 
                          background: '#ffc107', border: 'none', 
                          color: '#333', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold'
                      }}
                    >
                      Editar
                    </button>
                    
                    <button 
                      onClick={() => handleDeleteOrganist(org.id, org.name)}
                      style={{ 
                        fontSize: '0.8em', padding: '6px 10px', 
                        background: '#dc3545', border: 'none', 
                        color: 'white', borderRadius: '4px', cursor: 'pointer' 
                      }}
                    >
                      Excluir
                    </button>
                </div>
              </div>
              <div style={{ color: '#666', fontSize: '0.9em' }}>
                <strong>Disponível: </strong> 
                {formatAvailability(org.availability)}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ChurchDashboard;