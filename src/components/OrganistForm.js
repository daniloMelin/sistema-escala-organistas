// src/components/OrganistForm.js
import React, { useState, useEffect, useCallback } from 'react';
import { addOrganist, getOrganists, deleteOrganist } from '../services/firebaseService';

const OrganistForm = () => {
  // Estado inicial para disponibilidade com todos os dias da semana
  const initialAvailability = {
    sunday: false,
    monday: false,
    tuesday: false,
    wednesday: false,
    thursday: false,
    friday: false,
    saturday: false,
  };

  const [name, setName] = useState('');
  const [availability, setAvailability] = useState(initialAvailability);
  const [organists, setOrganists] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isListLoading, setIsListLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Array com todos os dias da semana para renderização dos checkboxes
  const allWeekDays = [
    { key: 'sunday', label: 'Domingo' },
    { key: 'monday', label: 'Segunda-feira' },
    { key: 'tuesday', label: 'Terça-feira' },
    { key: 'wednesday', label: 'Quarta-feira' },
    { key: 'thursday', label: 'Quinta-feira' },
    { key: 'friday', label: 'Sexta-feira' },
    { key: 'saturday', label: 'Sábado' },
  ];

  const clearMessages = useCallback(() => {
    setError('');
    setSuccessMessage('');
  }, []);

  const fetchOrganists = useCallback(async () => {
    setIsListLoading(true);
    try {
      const data = await getOrganists();
      setOrganists(data);
    } catch (err) {
      setError('Falha ao carregar organistas da lista.');
      console.error("Erro em fetchOrganists:", err);
    }
    setIsListLoading(false);
  }, []);

  useEffect(() => {
    fetchOrganists();
  }, [fetchOrganists]);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const handleAvailabilityChange = (e) => {
    const { name, checked } = e.target;
    setAvailability(prev => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearMessages();

    if (!name.trim()) {
      setError('O nome é obrigatório.');
      return;
    }

    setIsLoading(true);
    try {
      // O objeto 'availability' já terá todos os 7 dias
      await addOrganist({ name, availability });
      setName('');
      setAvailability(initialAvailability); // Reseta para o estado inicial com todos os dias
      setSuccessMessage('Organista adicionado com sucesso!');
      await fetchOrganists();
    } catch (err) {
      setError('Falha ao adicionar organista.');
      console.error("Erro no handleSubmit:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (organistId, organistName) => {
    clearMessages();
    if (window.confirm(`Tem certeza que deseja excluir ${organistName}? Esta ação não pode ser desfeita.`)) {
      setIsLoading(true);
      try {
        await deleteOrganist(organistId);
        setSuccessMessage(`Organista ${organistName} excluído com sucesso!`);
        await fetchOrganists();
      } catch (err) {
        setError(`Falha ao excluir organista ${organistName}.`);
        console.error("Erro no handleDelete:", err);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: 'auto' }}>
      <h2>Cadastro de Organistas</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="organistName">Nome:</label>
          <input
            type="text"
            id="organistName"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isLoading}
            required
            style={{ width: '100%', padding: '8px', margin: '8px 0', boxSizing: 'border-box' }}
          />
        </div>
        <fieldset style={{ margin: '8px 0', padding: '10px' }} disabled={isLoading}>
          <legend>Disponibilidade Semanal:</legend> {/* Título atualizado */}
          {allWeekDays.map(day => ( // Itera sobre allWeekDays
            <div key={day.key}>
              <input
                type="checkbox"
                id={`availability-${day.key}`}
                name={day.key} // 'name' deve corresponder às chaves em initialAvailability
                checked={availability[day.key]}
                onChange={handleAvailabilityChange}
              />
              <label htmlFor={`availability-${day.key}`}> {day.label}</label>
            </div>
          ))}
        </fieldset>
        {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
        {successMessage && <p style={{ color: 'green', marginTop: '10px' }}>{successMessage}</p>}
        <button
          type="submit"
          disabled={isLoading}
          style={{ padding: '10px 15px', cursor: isLoading ? 'not-allowed' : 'pointer', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', opacity: isLoading ? 0.6 : 1, marginTop: '10px' }}
        >
          {isLoading ? 'Salvando...' : 'Cadastrar Organista'}
        </button>
      </form>

      <h3 style={{ marginTop: '30px' }}>Organistas Cadastrados</h3>
      {isListLoading && <p>Carregando lista de organistas...</p>}
      {!isListLoading && organists.length === 0 && <p>Nenhum organista cadastrado.</p>}
      {!isListLoading && organists.length > 0 && (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {organists.map(org => (
            <li key={org.id} style={{ border: '1px solid #eee', padding: '10px', marginBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderRadius: '4px' }}>
              <div>
                <strong>{org.name}</strong>
                <p style={{ margin: '5px 0 0 0', fontSize: '0.9em' }}>
                  Disponível:
                  {/* Adaptar para mostrar os dias marcados, ou apenas os relevantes para a igreja */}
                  {allWeekDays.filter(day => org.availability[day.key]).map(day => day.label.substring(0,3) + "; ")}
                  {allWeekDays.every(day => !org.availability[day.key]) && "Nenhum dia"}
                </p>
              </div>
              <button
                onClick={() => handleDelete(org.id, org.name)}
                disabled={isLoading}
                style={{ padding: '8px 12px', cursor: isLoading ? 'not-allowed' : 'pointer', backgroundColor: '#f44336', color: 'white', border: 'none', borderRadius: '4px', opacity: isLoading ? 0.6 : 1 }}
                aria-label={`Excluir organista ${org.name}`}
              >
                Excluir
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default OrganistForm;