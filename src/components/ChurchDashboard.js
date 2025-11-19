import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getOrganistsByChurch, addOrganistToChurch, deleteOrganistFromChurch } from '../services/firebaseService';
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
  
  const [newOrganistName, setNewOrganistName] = useState('');
  const [availability, setAvailability] = useState(INITIAL_AVAILABILITY);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleAddOrganist = async (e) => {
    e.preventDefault();
    if (!newOrganistName.trim()) return;

    if (!user || !id) {
        alert("Erro de identificação. Tente recarregar a página.");
        return;
    }

    setIsSubmitting(true);
    try {
      await addOrganistToChurch(user.uid, id, {
        name: newOrganistName,
        availability: availability 
      });
      setNewOrganistName(''); 
      setAvailability(INITIAL_AVAILABILITY);
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
      {/* CABEÇALHO COM BOTÕES DE NAVEGAÇÃO */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <button 
          onClick={() => navigate('/')} 
          style={{ padding: '8px 12px', cursor: 'pointer' }}
        >
          &larr; Voltar para Igrejas
        </button>
        
        {/* --- NOVO BOTÃO: GERAR ESCALA --- */}
        <button 
            onClick={() => navigate(`/igreja/${id}/escala`)}
            style={{ 
                backgroundColor: '#007bff', 
                color: 'white', 
                border: 'none', 
                borderRadius: '4px', 
                padding: '10px 20px', 
                cursor: 'pointer',
                fontWeight: 'bold',
                boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
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

      {/* --- FORMULÁRIO --- */}
      <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '8px', marginBottom: '30px', border: '1px solid #ddd', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
        <h4 style={{ marginTop: 0, borderBottom: '1px solid #ccc', paddingBottom: '10px' }}>Cadastrar Nova Organista</h4>
        <form onSubmit={handleAddOrganist}>
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

          <button 
            type="submit" 
            disabled={isSubmitting} 
            style={{ padding: '10px 25px', cursor: isSubmitting ? 'wait' : 'pointer', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', fontWeight: 'bold', fontSize: '16px' }}
          >
            {isSubmitting ? 'Salvando...' : 'Cadastrar Organista'}
          </button>
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
                    <button disabled title="Edição em breve" style={{ fontSize: '0.8em', padding: '6px 10px', background: '#eee', border: 'none', color: '#999', borderRadius: '4px' }}>Editar</button>
                    <button onClick={() => handleDeleteOrganist(org.id, org.name)} style={{ fontSize: '0.8em', padding: '6px 10px', background: '#dc3545', border: 'none', color: 'white', borderRadius: '4px', cursor: 'pointer' }} title="Excluir organista">Excluir</button>
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