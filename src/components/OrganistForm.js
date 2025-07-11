import React, { useState, useEffect, useCallback } from 'react';
import { addOrganist, getOrganists, deleteOrganist, updateOrganist } from '../services/firebaseService';

// O componente agora recebe '{ user }' como uma propriedade (prop).
const OrganistForm = ({ user }) => { 
  const initialAvailability = {
    sunday: false, monday: false, tuesday: false, wednesday: false,
    thursday: false, friday: false, saturday: false,
  };

  const [name, setName] = useState('');
  const [availability, setAvailability] = useState(initialAvailability);
  const [organists, setOrganists] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isListLoading, setIsListLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [editingOrganist, setEditingOrganist] = useState(null);

  const allWeekDays = [
    { key: 'sunday', label: 'Domingo' }, { key: 'monday', label: 'Segunda-feira' },
    { key: 'tuesday', label: 'Terça-feira' }, { key: 'wednesday', label: 'Quarta-feira' },
    { key: 'thursday', label: 'Quinta-feira' }, { key: 'friday', label: 'Sexta-feira' },
    { key: 'saturday', label: 'Sábado' },
  ];

  const clearMessages = useCallback(() => { setError(''); setSuccessMessage(''); }, []);

  const fetchOrganists = useCallback(async () => {
    if (!user) return; // Não faz nada se não houver usuário logado.
    
    setIsListLoading(true);
    try {
      // Passa o ID do usuário (user.uid) para a função getOrganists.
      const data = await getOrganists(user.uid);
      setOrganists(data);
    } catch (err) {
      setError('Falha ao carregar a lista de organistas.');
      console.error("Erro em fetchOrganists:", err);
    }
    setIsListLoading(false);
  // Adiciona 'user' como dependência.
  }, [user]);

  useEffect(() => {
    fetchOrganists();
  }, [fetchOrganists]);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => { setSuccessMessage(''); }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const handleAvailabilityChange = (e) => {
    const { name, checked } = e.target;
    setAvailability(prev => ({ ...prev, [name]: checked }));
  };

  const handleCancelEdit = () => {
    setEditingOrganist(null);
    setName('');
    setAvailability(initialAvailability);
    clearMessages();
  };
  
  const handleStartEdit = (organist) => {
    clearMessages();
    setEditingOrganist(organist);
    setName(organist.name);
    const fullAvailability = { ...initialAvailability, ...organist.availability };
    setAvailability(fullAvailability);
    window.scrollTo(0, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearMessages();
    if (!name.trim()) {
      setError('O nome é obrigatório.');
      return;
    }
    setIsLoading(true);
    const data = { name, availability };
    try {
      if (editingOrganist) {
        // Passa 'user.uid' para a função de ATUALIZAR.
        await updateOrganist(user.uid, editingOrganist.id, data);
        setSuccessMessage('Organista atualizado com sucesso!');
      } else {
        // Passa 'user.uid' para a função de ADICIONAR.
        await addOrganist(user.uid, data);
        setSuccessMessage('Organista adicionado com sucesso!');
      }
      handleCancelEdit();
      await fetchOrganists();
    } catch (err) {
      const action = editingOrganist ? 'atualizar' : 'adicionar';
      setError(`Falha ao ${action} organista.`);
      console.error(`Erro ao ${action}:`, err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (organistId, organistName) => {
    if (window.confirm(`Tem certeza que deseja excluir ${organistName}?`)) {
      setIsLoading(true);
      try {
        // Passa 'user.uid' para a função de DELETAR.
        await deleteOrganist(user.uid, organistId);
        setSuccessMessage(`Organista ${organistName} excluído com sucesso!`);
        await fetchOrganists();
      } catch (err) {
        setError(`Falha ao excluir organista ${organistName}.`);
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: 'auto' }}>
      <h2>{editingOrganist ? 'Editar Organista' : 'Cadastro de Organistas'}</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="organistName">Nome Completo:</label>
          <input
            type="text" id="organistName" value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isLoading} required
            style={{ width: '100%', padding: '8px', margin: '8px 0', boxSizing: 'border-box' }}
          />
        </div>
        <fieldset style={{ margin: '8px 0', padding: '10px' }} disabled={isLoading}>
          <legend>Disponibilidade Semanal:</legend>
          {allWeekDays.map(day => (
            <div key={day.key}>
              <input
                type="checkbox" id={`availability-${day.key}`} name={day.key}
                checked={availability[day.key]}
                onChange={handleAvailabilityChange}
              />
              <label htmlFor={`availability-${day.key}`}> {day.label}</label>
            </div>
          ))}
        </fieldset>

        {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
        {successMessage && <p style={{ color: 'green', marginTop: '10px' }}>{successMessage}</p>}

        <div style={{display: 'flex', gap: '10px', marginTop: '10px'}}>
          <button type="submit" disabled={isLoading} style={{ flex: 1, padding: '10px 15px', cursor: isLoading ? 'not-allowed' : 'pointer', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', opacity: isLoading ? 0.6 : 1 }}>
            {isLoading ? 'Salvando...' : (editingOrganist ? 'Atualizar Organista' : 'Cadastrar Organista')}
          </button>
          {editingOrganist && (
            <button type="button" onClick={handleCancelEdit} disabled={isLoading} style={{ padding: '10px 15px', cursor: 'pointer', backgroundColor: '#777', color: 'white', border: 'none', borderRadius: '4px' }}>
              Cancelar Edição
            </button>
          )}
        </div>
      </form>

      <h3 style={{ marginTop: '30px' }}>Organistas Cadastrados</h3>
      {isListLoading && <p>Carregando lista...</p>}
      {!isListLoading && organists.length === 0 && <p>Nenhum organista cadastrado.</p>}
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {organists.map(org => (
          <li key={org.id} style={{ border: '1px solid #eee', padding: '10px', marginBottom: '10px', borderRadius: '4px' }}>
            <div>
              <strong>{org.name}</strong>
              <p style={{ margin: '5px 0 0 0', fontSize: '0.9em' }}>
                Disponível: {allWeekDays.filter(day => org.availability?.[day.key]).map(day => day.label.substring(0,3)).join('; ') || "Nenhum dia"}
              </p>
            </div>
            <div style={{display: 'flex', gap: '10px', marginTop: '10px'}}>
              <button
                onClick={() => handleStartEdit(org)}
                disabled={isLoading}
                style={{ padding: '8px 12px', cursor: 'pointer', backgroundColor: '#2196F3', color: 'white', border: 'none', borderRadius: '4px' }}
              >
                Editar
              </button>
              <button
                onClick={() => handleDelete(org.id, org.name)}
                disabled={isLoading}
                style={{ padding: '8px 12px', cursor: 'pointer', backgroundColor: '#f44336', color: 'white', border: 'none', borderRadius: '4px' }}
              >
                Excluir
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OrganistForm;