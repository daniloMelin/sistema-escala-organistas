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
import OrganistForm from './OrganistForm';
import OrganistList from './OrganistList';

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

      <OrganistForm
        editingId={editingId}
        newOrganistName={newOrganistName}
        isSubmitting={isSubmitting}
        error={error}
        successMessage={successMessage}
        visibleDays={visibleDays}
        availability={availability}
        onNameChange={setNewOrganistName}
        onCheckboxChange={handleCheckboxChange}
        onSubmit={handleSaveOrganist}
        onCancelEdit={handleCancelEdit}
      />
      <OrganistList
        loading={loading}
        organists={organists}
        formatOrganistAvailability={formatOrganistAvailability}
        onStartEdit={handleStartEdit}
        onRequestDeleteOrganist={handleRequestDeleteOrganist}
      />
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
