import React, { useState, useEffect, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { getChurches, addChurch, deleteChurchWithSubcollections, updateChurch } from '../services/firebaseService';
import { useNavigate } from 'react-router-dom';
import { useChurch } from '../contexts/ChurchContext';
import { SERVICE_TEMPLATES } from '../utils/scheduleLogic';
import { INITIAL_AVAILABILITY } from '../constants/days';
import { validateChurchName, validateChurchCode, sanitizeString } from '../utils/validation';
import logger from '../utils/logger';
import ConfirmDialog from './ui/ConfirmDialog';
import ChurchForm from './ChurchForm';
import ChurchList from './ChurchList';

const ChurchManager = ({ user }) => {
  const [churches, setChurches] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Estados do formulário
  const [churchName, setChurchName] = useState('');
  const [churchCode, setChurchCode] = useState('');

  // CONFIGURAÇÃO DOS DIAS DE CULTO
  const [selectedDays, setSelectedDays] = useState(INITIAL_AVAILABILITY);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [pendingDeleteChurch, setPendingDeleteChurch] = useState(null);

  const navigate = useNavigate();
  const { setSelectedChurch } = useChurch();

  const fetchChurches = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const userChurches = await getChurches(user.uid);
      setChurches(userChurches);
      setError('');
    } catch (err) {
      logger.error('Falha ao carregar as igrejas:', err);
      setError('Falha ao carregar as igrejas.');
    }
    setIsLoading(false);
  }, [user]);

  useEffect(() => {
    fetchChurches();
  }, [fetchChurches]);

  // --- LÓGICA INTELIGENTE: Transforma os checkboxes na estrutura que o robô entende ---
  const buildConfig = useMemo(() => {
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
  }, [selectedDays]);

  const handleStartEdit = (e, church) => {
    e.stopPropagation();
    setChurchName(church.name);
    setChurchCode(church.code || '');
    setEditingId(church.id);

    // Reconstrói os checkboxes baseados no que está salvo no banco
    if (church.config) {
      const newSelection = { ...INITIAL_AVAILABILITY };

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
    setSelectedDays(INITIAL_AVAILABILITY);
    setError('');
    setSuccessMessage('');
  };

  const handleDayChange = (key) => {
    setSelectedDays(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validação
    const nameValidation = validateChurchName(churchName);
    if (!nameValidation.isValid) {
      setError(nameValidation.error);
      return;
    }
    
    const codeValidation = validateChurchCode(churchCode);
    if (!codeValidation.isValid) {
      setError(codeValidation.error);
      return;
    }

    setIsSubmitting(true);
    setError('');
    setSuccessMessage('');

    try {
      const churchData = {
        name: sanitizeString(churchName),
        code: churchCode ? sanitizeString(churchCode) : '',
        config: buildConfig // Gera a configuração estruturada
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
      logger.error('Erro ao salvar igreja:', err);
    }
    setIsSubmitting(false);
  };

  const handleRequestDeleteChurch = (e, churchId, churchName) => {
    e.stopPropagation();
    setPendingDeleteChurch({ id: churchId, name: churchName });
  };

  const handleConfirmDeleteChurch = async () => {
    if (!pendingDeleteChurch) return;

    try {
      await deleteChurchWithSubcollections(user.uid, pendingDeleteChurch.id);
      setSuccessMessage('Igreja e dados associados excluídos com sucesso.');
      setError('');
      if (editingId === pendingDeleteChurch.id) handleCancelEdit();
      fetchChurches();
    } catch (err) {
      logger.error('Erro ao excluir igreja:', err);
      setError('Erro ao excluir igreja. Tente novamente.');
    } finally {
      setPendingDeleteChurch(null);
    }
  };

  const handleChurchSelect = (church) => {
    setSelectedChurch(church);
    navigate(`/igreja/${church.id}`);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: 'auto' }}>
      <h2>Gerenciamento de Igrejas</h2>
      {isLoading && (
        <div style={{ marginBottom: '15px', padding: '10px', background: '#fff3cd', borderRadius: '4px', border: '1px solid #ffeeba' }}>
          Carregando dados da igreja...
        </div>
      )}

      <ChurchForm
        editingId={editingId}
        churchName={churchName}
        churchCode={churchCode}
        selectedDays={selectedDays}
        isSubmitting={isSubmitting}
        isLoading={isLoading}
        error={error}
        successMessage={successMessage}
        onChurchNameChange={setChurchName}
        onChurchCodeChange={setChurchCode}
        onDayChange={handleDayChange}
        onSubmit={handleSubmit}
        onCancelEdit={handleCancelEdit}
      />
      <ChurchList
        churches={churches}
        isLoading={isLoading}
        onChurchSelect={handleChurchSelect}
        onStartEdit={handleStartEdit}
        onRequestDeleteChurch={handleRequestDeleteChurch}
      />
      <ConfirmDialog
        isOpen={Boolean(pendingDeleteChurch)}
        title="Excluir igreja"
        message={
          pendingDeleteChurch
            ? `Tem certeza que deseja excluir a igreja "${pendingDeleteChurch.name}"?\n\nATENÇÃO: Todas as organistas e escalas desta igreja serão perdidas para sempre.`
            : ''
        }
        confirmText="Excluir"
        cancelText="Cancelar"
        isDanger
        onConfirm={handleConfirmDeleteChurch}
        onCancel={() => setPendingDeleteChurch(null)}
      />
    </div>
  );
};

ChurchManager.propTypes = {
  user: PropTypes.shape({
    uid: PropTypes.string.isRequired,
    email: PropTypes.string,
  }).isRequired,
};

export default ChurchManager;
