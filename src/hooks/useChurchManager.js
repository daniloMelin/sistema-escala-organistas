import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useChurch } from '../contexts/ChurchContext';
import {
  getChurches,
  addChurch,
  deleteChurchWithSubcollections,
  updateChurch,
} from '../services/firebaseService';
import { INITIAL_AVAILABILITY } from '../constants/days';
import { validateChurchName, validateChurchCode, sanitizeString } from '../utils/validation';
import {
  DEFAULT_CULT_MODEL,
  buildChurchConfig,
  inferCultModelFromConfig,
  inferSelectedDaysFromConfig,
} from '../utils/churchCultModel';
import logger from '../utils/logger';

export const useChurchManager = (user) => {
  const [churches, setChurches] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [churchName, setChurchName] = useState('');
  const [churchCode, setChurchCode] = useState('');
  const [selectedDays, setSelectedDays] = useState(INITIAL_AVAILABILITY);
  const [cultoModel, setCultoModel] = useState(DEFAULT_CULT_MODEL);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const [loadError, setLoadError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [pendingDeleteChurch, setPendingDeleteChurch] = useState(null);
  const isMountedRef = useRef(false);

  const navigate = useNavigate();
  const { setSelectedChurch } = useChurch();

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const fetchChurches = useCallback(async () => {
    if (!user) return;
    if (isMountedRef.current) {
      setIsLoading(true);
      setLoadError('');
    }
    try {
      const userChurches = await getChurches(user.uid);
      if (!isMountedRef.current) return;
      setChurches(userChurches);
      setLoadError('');
    } catch (err) {
      if (!isMountedRef.current) return;
      logger.error('Falha ao carregar as igrejas:', err);
      setLoadError('Falha ao carregar as igrejas.');
    } finally {
      if (isMountedRef.current) setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchChurches();
  }, [fetchChurches]);

  const buildConfig = useMemo(() => {
    return buildChurchConfig(selectedDays, cultoModel);
  }, [cultoModel, selectedDays]);

  const handleStartEdit = (e, church) => {
    e.stopPropagation();
    setChurchName(church.name);
    setChurchCode(church.code || '');
    setEditingId(church.id);

    if (church.config) {
      setSelectedDays(inferSelectedDaysFromConfig(church.config));
    }
    setCultoModel(church.cultoModel || inferCultModelFromConfig(church.config));

    setError('');
    setLoadError('');
    setSuccessMessage('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setChurchName('');
    setChurchCode('');
    setEditingId(null);
    setSelectedDays(INITIAL_AVAILABILITY);
    setCultoModel(DEFAULT_CULT_MODEL);
    setError('');
    setLoadError('');
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
    setLoadError('');
    setSuccessMessage('');

    try {
      const churchData = {
        name: sanitizeString(churchName),
        code: churchCode ? sanitizeString(churchCode) : '',
        config: buildConfig,
        cultoModel,
      };

      if (editingId) {
        await updateChurch(user.uid, editingId, churchData);
        if (!isMountedRef.current) return;
        setSuccessMessage('Igreja atualizada!');
      } else {
        await addChurch(user.uid, churchData);
        if (!isMountedRef.current) return;
        setSuccessMessage('Igreja criada!');
      }
      if (!isMountedRef.current) return;
      handleCancelEdit();
      await fetchChurches();
    } catch (err) {
      if (!isMountedRef.current) return;
      setError('Erro ao salvar.');
      logger.error('Erro ao salvar igreja:', err);
    } finally {
      if (isMountedRef.current) setIsSubmitting(false);
    }
  };

  const handleRequestDeleteChurch = (e, churchId, churchName) => {
    e.stopPropagation();
    setPendingDeleteChurch({ id: churchId, name: churchName });
  };

  const handleConfirmDeleteChurch = async () => {
    if (!pendingDeleteChurch) return;

    try {
      await deleteChurchWithSubcollections(user.uid, pendingDeleteChurch.id);
      if (!isMountedRef.current) return;
      setSuccessMessage('Igreja e dados associados excluídos com sucesso.');
      setError('');
      setLoadError('');
      if (editingId === pendingDeleteChurch.id) handleCancelEdit();
      await fetchChurches();
    } catch (err) {
      if (!isMountedRef.current) return;
      logger.error('Erro ao excluir igreja:', err);
      setError('Erro ao excluir igreja. Tente novamente.');
    } finally {
      if (isMountedRef.current) setPendingDeleteChurch(null);
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
    cultoModel,
    isSubmitting,
    editingId,
    error,
    loadError,
    successMessage,
    pendingDeleteChurch,
    setChurchName,
    setChurchCode,
    setCultoModel,
    setPendingDeleteChurch,
    handleStartEdit,
    handleCancelEdit,
    handleDayChange,
    handleSubmit,
    handleRequestDeleteChurch,
    handleConfirmDeleteChurch,
    handleChurchSelect,
    handleRetryLoadChurches: fetchChurches,
  };
};
