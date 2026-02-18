import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useParams, useNavigate } from 'react-router-dom';
import { getOrganistsByChurch, addOrganistToChurch, deleteOrganistFromChurch, updateOrganistInChurch, getChurch } from '../services/firebaseService';
import { useChurch } from '../contexts/ChurchContext';
import { ALL_WEEK_DAYS, INITIAL_AVAILABILITY, formatAvailability } from '../constants/days';
import { validateOrganistName, sanitizeString } from '../utils/validation';
import logger from '../utils/logger';
import ConfirmDialog from './ui/ConfirmDialog';
import Button from './ui/Button';
import Input from './ui/Input';

const ChurchDashboard = ({ user }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { selectedChurch } = useChurch();

  const [organists, setOrganists] = useState([]);
  const [loading, setLoading] = useState(true);

  // Estado para controlar quais dias aparecem no formulário
  const [visibleDays, setVisibleDays] = useState([]);

  const [newOrganistName, setNewOrganistName] = useState('');
  const [availability, setAvailability] = useState(INITIAL_AVAILABILITY);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [pendingDeleteOrganist, setPendingDeleteOrganist] = useState(null);

  // Carrega Dados (Organistas + Configuração da Igreja)
  const fetchData = useCallback(async () => {
    if (!user || !id) return;
    setLoading(true);
    setError('');
    try {
      // 1. Busca Organistas
      const orgsData = await getOrganistsByChurch(user.uid, id);
      setOrganists(orgsData);

      // 2. Busca a Igreja para saber os dias de culto
      const churchData = await getChurch(user.uid, id);

      if (churchData && churchData.config) {
        // Filtra os dias baseado na configuração
        const config = churchData.config;
        const filteredDays = ALL_WEEK_DAYS.filter(dayObj => {

          // Lógica especial para Domingo
          if (dayObj.key === 'sunday_rjm') {
            return config.sunday && config.sunday.some(s => s.id === 'RJM');
          }
          if (dayObj.key === 'sunday_culto') {
            return config.sunday && config.sunday.some(s => s.id === 'Culto');
          }

          // Lógica para dias normais (segunda a sábado)
          // Se a chave (ex: 'tuesday') existe no config, mostra o dia
          return config.hasOwnProperty(dayObj.key);
        });

        setVisibleDays(filteredDays);
      } else {
        // Fallback: Se não tiver config (igreja antiga), mostra tudo
        setVisibleDays(ALL_WEEK_DAYS);
      }
      setError('');

    } catch (error) {
      logger.error("Erro ao carregar dados:", error);
      setError('Falha ao carregar dados da igreja.');
    } finally {
      setLoading(false);
    }
  }, [user, id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setAvailability(prev => ({ ...prev, [name]: checked }));
  };

  const handleStartEdit = (organist) => {
    setNewOrganistName(organist.name);

    // Mapeia disponibilidade antiga (se houver 'sunday', converte para 'sunday_culto' para compatibilidade)
    let loadedAvailability = { ...INITIAL_AVAILABILITY, ...organist.availability };
    if (organist.availability && organist.availability.sunday !== undefined) {
      // Migração visual rápida para dados antigos
      loadedAvailability.sunday_culto = organist.availability.sunday;
    }

    setAvailability(loadedAvailability);
    setEditingId(organist.id);
    setError('');
    setSuccessMessage('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setNewOrganistName('');
    setAvailability(INITIAL_AVAILABILITY);
    setEditingId(null);
    setError('');
  };

  const handleSaveOrganist = async (e) => {
    e.preventDefault();
    
    // Validação
    const nameValidation = validateOrganistName(newOrganistName);
    if (!nameValidation.isValid) {
      setError(nameValidation.error);
      return;
    }

    if (!user || !id) {
      setError("Erro de identificação.");
      return;
    }

    setIsSubmitting(true);
    setError('');
    setSuccessMessage('');
    try {
      const organistData = {
        name: sanitizeString(newOrganistName),
        availability: availability,
      };

      if (editingId) {
        await updateOrganistInChurch(user.uid, id, editingId, organistData);
      } else {
        await addOrganistToChurch(user.uid, id, organistData);
      }

      handleCancelEdit();
      await fetchData(); // Recarrega tudo
      setSuccessMessage(editingId ? 'Organista atualizada com sucesso.' : 'Organista cadastrada com sucesso.');

    } catch (error) {
      logger.error("Erro ao salvar organista:", error);
      setError("Erro ao salvar organista.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRequestDeleteOrganist = (organistId, organistName) => {
    setPendingDeleteOrganist({ id: organistId, name: organistName });
  };

  const handleConfirmDeleteOrganist = async () => {
    if (!pendingDeleteOrganist) return;
    try {
      await deleteOrganistFromChurch(user.uid, id, pendingDeleteOrganist.id);
      await fetchData();
      setSuccessMessage('Organista excluída com sucesso.');
      setError('');
    } catch (error) {
      logger.error("Erro ao excluir organista:", error);
      setError("Erro ao excluir organista.");
    } finally {
      setPendingDeleteOrganist(null);
    }
  };

  // Usa a função formatAvailability importada de constants/days.js
  const formatOrganistAvailability = useCallback((avail) => {
    return formatAvailability(avail);
  }, []);

  if (!user) return <div style={{ padding: 20 }}>Carregando...</div>;

  return (
    <div style={{ padding: '20px', maxWidth: '900px', margin: 'auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <Button onClick={() => navigate('/')} variant="secondary" style={{ padding: '8px 12px', fontSize: '14px' }}>
          &larr; Voltar para Igrejas
        </Button>
        <Button
          onClick={() => navigate(`/igreja/${id}/escala`)}
          variant="primary"
          style={{ boxShadow: '0 2px 5px rgba(0,0,0,0.2)' }}
        >
          📅 Gerar Escala
        </Button>
      </div>

      <div style={{ borderBottom: '2px solid #eee', paddingBottom: '10px', marginBottom: '20px' }}>
        <h2>Painel de Gerenciamento</h2>
        <h3 style={{ color: '#0056b3', margin: '5px 0' }}>
          {selectedChurch ? selectedChurch.name : `Igreja (ID: ${id})`}
        </h3>
      </div>

      {/* --- FORMULÁRIO --- */}
      <div style={{
        background: editingId ? '#fff3cd' : '#f8f9fa',
        padding: '20px', borderRadius: '8px', marginBottom: '30px',
        border: editingId ? '1px solid #ffeeba' : '1px solid #ddd',
      }}>
        <h4 style={{ marginTop: 0, borderBottom: '1px solid #ccc', paddingBottom: '10px' }}>
          {editingId ? `Editando: ${newOrganistName}` : 'Cadastrar Nova Organista'}
        </h4>

        <form onSubmit={handleSaveOrganist}>
          {error && (
            <p style={{ color: 'red', marginTop: 0, marginBottom: '12px' }}>{error}</p>
          )}
          {successMessage && (
            <p style={{ color: 'green', marginTop: 0, marginBottom: '12px' }}>{successMessage}</p>
          )}
          <Input
            label="Nome da Organista:"
            type="text"
            value={newOrganistName}
            onChange={(e) => setNewOrganistName(e.target.value)}
            required
            disabled={isSubmitting}
            style={{ padding: '10px' }}
          />

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'normal' }}>
              Disponibilidade (Baseado nos dias de culto desta igreja):
            </label>

            {visibleDays.length === 0 ? (
              <p style={{ color: 'orange', fontStyle: 'italic' }}>
                Nenhum dia de culto configurado para esta igreja. Vá em "Minhas Igrejas" e edite as configurações.
              </p>
            ) : (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {visibleDays.map(day => (
                  <div key={day.key} style={{
                    display: 'flex', alignItems: 'center', gap: '5px',
                    background: 'white', padding: '8px 12px', borderRadius: '4px', border: '1px solid #ccc'
                  }}>
                    <input
                      type="checkbox"
                      id={day.key}
                      name={day.key}
                      checked={availability[day.key]}
                      onChange={handleCheckboxChange}
                      disabled={isSubmitting}
                    />
                    <label htmlFor={day.key} style={{ cursor: 'pointer', fontSize: '0.9em' }}>{day.label}</label>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <Button
              type="submit" disabled={isSubmitting}
              variant={editingId ? 'warning' : 'success'}
              style={{ flex: 1 }}
            >
              {isSubmitting ? 'Salvando...' : (editingId ? 'Atualizar Organista' : 'Cadastrar Organista')}
            </Button>

            {editingId && (
              <Button type="button" onClick={handleCancelEdit} disabled={isSubmitting} variant="secondary" style={{ fontSize: '14px' }}>
                Cancelar
              </Button>
            )}
          </div>
        </form>
      </div>

      {/* --- LISTA --- */}
      <h3>Organistas Cadastradas</h3>
      {loading ? <p>Carregando dados...</p> : organists.length === 0 ? <p>Nenhuma organista cadastrada.</p> : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {organists.map((org) => (
            <li key={org.id} style={{ padding: '15px', marginBottom: '10px', border: '1px solid #eee', borderRadius: '6px', background: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                <div>
                  <strong style={{ fontSize: '1.1em', color: '#333' }}>{org.name}</strong>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <Button onClick={() => handleStartEdit(org)} variant="warning" style={{ fontSize: '12px', padding: '6px 10px' }}>
                    Editar
                  </Button>
                  <Button onClick={() => handleRequestDeleteOrganist(org.id, org.name)} variant="danger" style={{ fontSize: '12px', padding: '6px 10px' }}>
                    Excluir
                  </Button>
                </div>
              </div>
              <div style={{ color: '#666', fontSize: '0.9em' }}>
                <strong>Disponível: </strong> {formatOrganistAvailability(org.availability)}
              </div>
            </li>
          ))}
        </ul>
      )}
      <ConfirmDialog
        isOpen={Boolean(pendingDeleteOrganist)}
        title="Excluir organista"
        message={
          pendingDeleteOrganist
            ? `Tem certeza que deseja excluir a organista ${pendingDeleteOrganist.name}?`
            : ''
        }
        confirmText="Excluir"
        cancelText="Cancelar"
        isDanger
        onConfirm={handleConfirmDeleteOrganist}
        onCancel={() => setPendingDeleteOrganist(null)}
      />
    </div>
  );
};

ChurchDashboard.propTypes = {
  user: PropTypes.shape({
    uid: PropTypes.string.isRequired,
    email: PropTypes.string,
  }).isRequired,
};

export default ChurchDashboard;
