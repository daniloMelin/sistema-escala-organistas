import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useChurch } from '../contexts/ChurchContext';
import {
  getChurches,
  addChurch,
  deleteChurchWithSubcollections,
  updateChurch,
  getOrganistsByChurch,
  getChurchScheduleCount,
} from '../services/firebaseService';
import { INITIAL_AVAILABILITY } from '../constants/days';
import { INITIAL_REHEARSAL, normalizeRehearsal } from '../constants/rehearsal';
import {
  validateChurchName,
  validateChurchRehearsal,
  validateChurchRehearsalField,
  sanitizeString,
} from '../utils/validation';
import {
  DEFAULT_CULT_MODEL,
  buildChurchConfig,
  inferCultModelFromConfig,
  inferSelectedDaysFromConfig,
  getCultModelLabel,
  getCultModelMinimumOrganists,
} from '../utils/churchCultModel';
import logger from '../utils/logger';

const hasUsefulChurchConfig = (config) =>
  Boolean(config && typeof config === 'object' && Object.values(config).some(Array.isArray));

const READINESS_PRIORITY = {
  incomplete: 0,
  warning: 1,
  ready: 2,
};

const getChurchReadiness = ({ config, organistCount, scheduleCount, cultoModel }) => {
  if (!hasUsefulChurchConfig(config) || organistCount === 0) {
    return {
      label: 'Incompleta',
      tone: 'incomplete',
      detail: !hasUsefulChurchConfig(config)
        ? 'Sem configuração útil para operar.'
        : 'Nenhuma organista cadastrada.',
    };
  }

  const minimumOrganists = getCultModelMinimumOrganists(cultoModel || DEFAULT_CULT_MODEL);
  if (organistCount < minimumOrganists || scheduleCount === 0) {
    return {
      label: 'Atenção',
      tone: 'warning',
      detail:
        organistCount < minimumOrganists
          ? `Base abaixo do mínimo para ${getCultModelLabel(cultoModel || DEFAULT_CULT_MODEL)}.`
          : 'Ainda não possui escala salva.',
    };
  }

  return {
    label: 'Pronta',
    tone: 'ready',
    detail: 'Base mínima atendida e histórico disponível.',
  };
};

const buildFallbackChurchSummary = (church) => {
  const effectiveCultoModel =
    church.cultoModel || inferCultModelFromConfig(church.config) || DEFAULT_CULT_MODEL;

  return {
    ...church,
    cultoModel: effectiveCultoModel,
  };
};

const sortChurchesByOperationalPriority = (churches) =>
  [...churches].sort((a, b) => {
    const aPriority =
      READINESS_PRIORITY[a.operationalSummary?.readiness?.tone] ?? Number.MAX_SAFE_INTEGER;
    const bPriority =
      READINESS_PRIORITY[b.operationalSummary?.readiness?.tone] ?? Number.MAX_SAFE_INTEGER;

    if (aPriority !== bPriority) {
      return aPriority - bPriority;
    }

    return a.name.localeCompare(b.name, 'pt-BR');
  });

const INITIAL_FIELD_ERRORS = {
  churchName: '',
  rehearsalWeekOfMonth: '',
  rehearsalWeekday: '',
  rehearsalTime: '',
  rehearsalNotes: '',
};

export const useChurchManager = (user) => {
  const [churches, setChurches] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [churchName, setChurchName] = useState('');
  const [churchCode, setChurchCode] = useState('');
  const [selectedDays, setSelectedDays] = useState(INITIAL_AVAILABILITY);
  const [cultoModel, setCultoModel] = useState(DEFAULT_CULT_MODEL);
  const [rehearsal, setRehearsal] = useState(INITIAL_REHEARSAL);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState(INITIAL_FIELD_ERRORS);
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

      const churchesWithSummary = await Promise.all(
        userChurches.map(async (church) => {
          try {
            const organists = await getOrganistsByChurch(user.uid, church.id);
            const scheduleCount = await getChurchScheduleCount(user.uid, church.id);
            const effectiveCultoModel =
              church.cultoModel || inferCultModelFromConfig(church.config) || DEFAULT_CULT_MODEL;
            const readiness = getChurchReadiness({
              config: church.config,
              organistCount: organists.length,
              scheduleCount,
              cultoModel: effectiveCultoModel,
            });

            return {
              ...church,
              cultoModel: effectiveCultoModel,
              operationalSummary: {
                cultoModelLabel: getCultModelLabel(effectiveCultoModel),
                organistCount: organists.length,
                scheduleCount,
                readiness,
              },
            };
          } catch (summaryError) {
            logger.error(`Falha ao enriquecer resumo da igreja ${church.id}:`, summaryError);
            return buildFallbackChurchSummary(church);
          }
        })
      );

      setChurches(sortChurchesByOperationalPriority(churchesWithSummary));
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
    setRehearsal(normalizeRehearsal(church.rehearsal));

    if (church.config) {
      setSelectedDays(inferSelectedDaysFromConfig(church.config));
    }
    setCultoModel(church.cultoModel || inferCultModelFromConfig(church.config));

    setError('');
    setFieldErrors(INITIAL_FIELD_ERRORS);
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
    setRehearsal(INITIAL_REHEARSAL);
    setError('');
    setFieldErrors(INITIAL_FIELD_ERRORS);
    setLoadError('');
  };

  const setFieldError = (field, value) => {
    setFieldErrors((prev) => ({ ...prev, [field]: value }));
  };

  const handleChurchNameChange = (value) => {
    setChurchName(value);
    if (fieldErrors.churchName) setFieldError('churchName', '');
  };

  const handleChurchNameBlur = () => {
    const validation = validateChurchName(churchName);
    setFieldError('churchName', validation.isValid ? '' : validation.error);
  };

  const handleDayChange = (key) => {
    setSelectedDays((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleRehearsalChange = (field, value) => {
    setRehearsal((prev) => ({ ...prev, [field]: value }));
    const fieldMap = {
      weekOfMonth: 'rehearsalWeekOfMonth',
      weekday: 'rehearsalWeekday',
      time: 'rehearsalTime',
      notes: 'rehearsalNotes',
    };
    const errorField = fieldMap[field];
    if (errorField && fieldErrors[errorField]) {
      setFieldError(errorField, '');
    }
  };

  const handleRehearsalBlur = (field) => {
    const validation = validateChurchRehearsalField(field, rehearsal);
    const fieldMap = {
      weekOfMonth: 'rehearsalWeekOfMonth',
      weekday: 'rehearsalWeekday',
      time: 'rehearsalTime',
      notes: 'rehearsalNotes',
    };
    const errorField = fieldMap[field];
    if (errorField) {
      setFieldError(errorField, validation.isValid ? '' : validation.error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setFieldErrors(INITIAL_FIELD_ERRORS);

    const nameValidation = validateChurchName(churchName);
    if (!nameValidation.isValid) {
      setFieldError('churchName', nameValidation.error);
      setError('');
      return;
    }

    const rehearsalValidation = validateChurchRehearsal(rehearsal);
    if (!rehearsalValidation.isValid) {
      const rehearsalFields = ['weekOfMonth', 'weekday', 'time', 'notes'];
      const firstInvalidField = rehearsalFields.find(
        (field) => !validateChurchRehearsalField(field, rehearsal).isValid
      );
      const fieldMap = {
        weekOfMonth: 'rehearsalWeekOfMonth',
        weekday: 'rehearsalWeekday',
        time: 'rehearsalTime',
        notes: 'rehearsalNotes',
      };

      if (firstInvalidField) {
        const fieldValidation = validateChurchRehearsalField(firstInvalidField, rehearsal);
        setFieldError(
          fieldMap[firstInvalidField],
          fieldValidation.error || rehearsalValidation.error
        );
      }
      setError('');
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
        rehearsal: {
          weekOfMonth: Number(rehearsal.weekOfMonth),
          weekday: rehearsal.weekday,
          time: rehearsal.time,
          notes: rehearsal.notes ? sanitizeString(rehearsal.notes) : '',
        },
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
    rehearsal,
    isSubmitting,
    editingId,
    error,
    fieldErrors,
    loadError,
    successMessage,
    pendingDeleteChurch,
    setChurchName,
    setChurchCode,
    setCultoModel,
    setRehearsal,
    setPendingDeleteChurch,
    handleStartEdit,
    handleCancelEdit,
    handleChurchNameChange,
    handleChurchNameBlur,
    handleDayChange,
    handleRehearsalChange,
    handleRehearsalBlur,
    handleSubmit,
    handleRequestDeleteChurch,
    handleConfirmDeleteChurch,
    handleChurchSelect,
    handleRetryLoadChurches: fetchChurches,
  };
};
