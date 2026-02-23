import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useChurch } from '../contexts/ChurchContext';
import {
  getChurches,
  addChurch,
  deleteChurchWithSubcollections,
  updateChurch,
} from '../services/firebaseService';
import { SERVICE_TEMPLATES } from '../utils/scheduleLogic';
import { INITIAL_AVAILABILITY } from '../constants/days';
import {
  validateChurchName,
  validateChurchCode,
  sanitizeString,
} from '../utils/validation';
import logger from '../utils/logger';

export const useChurchManager = (user) => {
  const [churches, setChurches] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [churchName, setChurchName] = useState('');
  const [churchCode, setChurchCode] = useState('');
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

  const buildConfig = useMemo(() => {
    const config = {};
    const addServicesToDay = (dayKey, servicesToAdd) => {
      if (!config[dayKey]) config[dayKey] = [];
      config[dayKey].push(...servicesToAdd);
    };

    if (selectedDays.sunday_rjm) addServicesToDay('sunday', [SERVICE_TEMPLATES.RJM]);
    if (selectedDays.sunday_culto) {
      addServicesToDay('sunday', [SERVICE_TEMPLATES.MeiaHora, SERVICE_TEMPLATES.Culto]);
    }

    ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'].forEach((day) => {
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

    if (church.config) {
      const newSelection = { ...INITIAL_AVAILABILITY };
      Object.keys(church.config).forEach((dayKey) => {
        const services = church.config[dayKey];
        if (dayKey === 'sunday') {
          if (services.some((s) => s.id === 'RJM')) newSelection.sunday_rjm = true;
          if (services.some((s) => s.id === 'Culto')) newSelection.sunday_culto = true;
        } else if (Object.prototype.hasOwnProperty.call(newSelection, dayKey)) {
          newSelection[dayKey] = true;
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
    setSelectedDays(INITIAL_AVAILABILITY);
    setError('');
    setSuccessMessage('');
  };

  const handleDayChange = (key) => {
    setSelectedDays((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

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
        config: buildConfig,
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

  return {
    churches,
    isLoading,
    churchName,
    churchCode,
    selectedDays,
    isSubmitting,
    editingId,
    error,
    successMessage,
    pendingDeleteChurch,
    setChurchName,
    setChurchCode,
    setPendingDeleteChurch,
    handleStartEdit,
    handleCancelEdit,
    handleDayChange,
    handleSubmit,
    handleRequestDeleteChurch,
    handleConfirmDeleteChurch,
    handleChurchSelect,
  };
};

