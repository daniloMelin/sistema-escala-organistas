import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getOrganistsByChurch, addOrganistToChurch } from '../services/firebaseService';
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

  // Busca as organistas ao carregar
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

  // Lógica para marcar/desmarcar os dias
  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setAvailability(prev => ({ ...prev, [name]: checked }));
  };

  // Salvar organista com disponibilidade
  const handleAddOrganist = async (e) => {
    e.preventDefault();
    if (!newOrganistName.trim()) return;

    if (!user || !id) {
        alert("Erro de identificação. Tente recarregar a página.");
        return;
    }

    setIsSubmitting(true);
    try {
      // Agora passamos o objeto availability completo
      await addOrganistToChurch(user.uid, id, {
        name: newOrganistName,
        availability: availability 
      });
      
      // Limpa o formulário
      setNewOrganistName(''); 
      setAvailability(INITIAL_AVAILABILITY);
      
      await fetchOrganists(); // Recarrega lista
    } catch (error) {
      console.error("Erro ao salvar:", error);
      alert("Erro ao salvar organista.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Função auxiliar para mostrar os dias na lista de forma bonita
  const formatAvailability = (avail) => {
    if (!avail) return "Sem disponibilidade";
    const activeDays = WEEK_DAYS.filter(day => avail[day.key]);
    if (activeDays.length === 0) return "Nenhum dia";
    return activeDays.map(d => d.label.substring(0, 3)).join(', ');
  };

  if (!user) return <div style={{ padding: 20 }}>Carregando...</div>;

  return (
    <div style={{ padding: '20px', maxWidth: '900px', margin: 'auto' }}>
      <button 
        onClick={() => navigate('/')} 
        style={{ marginBottom: '20px', padding: '8px 12px', cursor: 'pointer' }}
      >
        &larr; Voltar para Igrejas
      </button>

      <div style={{ borderBottom: '2px solid #eee', paddingBottom: '10px', marginBottom: '20px' }}>
        <h2>Painel de Gerenciamento</h2>
        <h3 style={{ color: '#0056b3', margin: '5px 0' }}>
            {selectedChurch ? selectedChurch.name : `Igreja (ID: ${id})`}
        </h3>
      </div>

      {/* --- FORMULÁRIO DE CADASTRO --- */}
      <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '8px', marginBottom: '30px', border: '1px solid #ddd', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
        <h4 style={{ marginTop: 0, borderBottom: '1px solid #ccc', paddingBottom: '10px' }}>Cadastrar Nova Organista</h4>
        
        <form onSubmit={handleAddOrganist}>
          {/* Campo Nome */}
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

          {/* Campo Disponibilidade */}
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
            style={{ 
                padding: '10px 25px', 
                cursor: isSubmitting ? 'wait' : 'pointer',
                backgroundColor: '#28a745', 
                color: 'white', 
                border: 'none', 
                borderRadius: '4px',
                fontWeight: 'bold',
                fontSize: '16px'
            }}
          >
            {isSubmitting ? 'Salvando...' : 'Cadastrar Organista'}
          </button>
        </form>
      </div>

      {/* --- LISTA DE ORGANISTAS --- */}
      <h3>Equipe Cadastrada</h3>
      {loading ? (
        <p>Carregando dados...</p>
      ) : organists.length === 0 ? (
        <p>Nenhuma organista cadastrada nesta igreja ainda.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {organists.map((org) => (
            <li key={org.id} style={{ 
              padding: '15px', 
              marginBottom: '10px',
              border: '1px solid #eee', 
              borderRadius: '6px',
              background: 'white',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                <strong style={{ fontSize: '1.1em', color: '#333' }}>{org.name}</strong>
                <button 
                  disabled 
                  title="Edição em breve"
                  style={{ fontSize: '0.8em', padding: '4px 8px', background: '#eee', border: 'none', color: '#999', borderRadius: '4px' }}
                >
                  Editar
                </button>
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