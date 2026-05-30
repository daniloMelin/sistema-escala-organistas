import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams } from 'react-router-dom';
import {
  getOrganistsByChurch,
  addOrganistToChurch,
  deleteOrganistFromChurch,
  updateOrganistInChurch,
  getChurch,
} from '../services/firebaseService';
import { ALL_WEEK_DAYS, INITIAL_AVAILABILITY, formatAvailability } from '../constants/days';
import { getVisibleDaysFromConfig } from '../utils/churchCultModel';
import {
  normalizeComparableString,
  validateOrganistAvailability,
  validateOrganistName,
  sanitizeString,
} from '../utils/validation';
import logger from '../utils/logger';

const INITIAL_FIELD_ERRORS = {
  organistName: '',
  availability: '',
};

export const useChurchDashboard = (user) => {
  const { id } = useParams();

  const [church, setChurch] = useState(null);
  const [organists, setOrganists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleDays, setVisibleDays] = useState([]);
  const [newOrganistName, setNewOrganistName] = useState('');
  const [availability, setAvailability] = useState(INITIAL_AVAILABILITY);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState(INITIAL_FIELD_ERRORS);
  const [successMessage, setSuccessMessage] = useState('');
  const [pendingDeleteOrganist, setPendingDeleteOrganist] = useState(null);
  const isMountedRef = useRef(false);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const fetchData = useCallback(async () => {
    if (!user || !id) return;
    if (isMountedRef.current) {
      setLoading(true);
      setError('');
    }
    try {
      const [orgsData, churchData] = await Promise.all([
        getOrganistsByChurch(user.uid, id),
        getChurch(user.uid, id),
      ]);
      if (!isMountedRef.current) return;

      setOrganists(orgsData);
      setChurch(churchData || null);

      if (churchData && churchData.config) {
        setVisibleDays(getVisibleDaysFromConfig(churchData.config, ALL_WEEK_DAYS));
      } else {
        setVisibleDays(ALL_WEEK_DAYS);
      }
      setError('');
    } catch (fetchError) {
      if (!isMountedRef.current) return;
      logger.error('Erro ao carregar dados:', fetchError);
      setError('Falha ao carregar dados da igreja.');
    } finally {
      if (isMountedRef.current) setLoading(false);
    }
  }, [id, user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setAvailability((prev) => ({ ...prev, [name]: checked }));
    if (fieldErrors.availability) {
      setFieldErrors((prev) => ({ ...prev, availability: '' }));
    }
  };

  const handleStartEdit = (organist) => {
    setNewOrganistName(organist.name);

    const loadedAvailability = { ...INITIAL_AVAILABILITY, ...organist.availability };
    if (organist.availability && organist.availability.sunday !== undefined) {
      loadedAvailability.sunday_culto = organist.availability.sunday;
    }

    setAvailability(loadedAvailability);
    setEditingId(organist.id);
    setError('');
    setFieldErrors(INITIAL_FIELD_ERRORS);
    setSuccessMessage('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setNewOrganistName('');
    setAvailability(INITIAL_AVAILABILITY);
    setEditingId(null);
    setError('');
    setFieldErrors(INITIAL_FIELD_ERRORS);
  };

  const handleOrganistNameChange = (value) => {
    setNewOrganistName(value);
    if (fieldErrors.organistName) {
      setFieldErrors(INITIAL_FIELD_ERRORS);
    }
  };

  const handleOrganistNameBlur = () => {
    const existingOrganist = organists.find((organist) => organist.id === editingId);
    const isKeepingLegacyName =
      Boolean(existingOrganist) &&
      normalizeComparableString(existingOrganist.name) ===
        normalizeComparableString(newOrganistName);

    if (isKeepingLegacyName) {
      setFieldErrors(INITIAL_FIELD_ERRORS);
      return;
    }

    const validation = validateOrganistName(newOrganistName);
    setFieldErrors({
      organistName: validation.isValid ? '' : validation.error,
      availability: fieldErrors.availability,
    });
  };

  const hasDuplicateOrganistName = useCallback(
    (sanitizedName) => {
      const normalizedName = normalizeComparableString(sanitizedName);

      return organists.some((organist) => {
        if (editingId && organist.id === editingId) return false;
        return normalizeComparableString(organist.name) === normalizedName;
      });
    },
    [editingId, organists]
  );

  const handleSaveOrganist = async (e) => {
    e.preventDefault();

    setFieldErrors(INITIAL_FIELD_ERRORS);

    const existingOrganist = organists.find((organist) => organist.id === editingId);
    const isKeepingLegacyName =
      Boolean(existingOrganist) &&
      normalizeComparableString(existingOrganist.name) ===
        normalizeComparableString(newOrganistName);

    const nameValidation = isKeepingLegacyName
      ? { isValid: true }
      : validateOrganistName(newOrganistName);
    if (!nameValidation.isValid) {
      setFieldErrors({
        organistName: nameValidation.error,
        availability: '',
      });
      setError('');
      return;
    }

    if (!user || !id) {
      setError('Erro de identificação.');
      return;
    }

    const availabilityValidation = validateOrganistAvailability(availability, visibleDays);
    if (!availabilityValidation.isValid) {
      setFieldErrors({
        organistName: '',
        availability: availabilityValidation.error,
      });
      setError('');
      return;
    }

    const sanitizedName = isKeepingLegacyName
      ? existingOrganist.name
      : sanitizeString(newOrganistName);

    if (!isKeepingLegacyName && hasDuplicateOrganistName(sanitizedName)) {
      setError('Já existe uma organista com este nome nesta igreja.');
      return;
    }

    setIsSubmitting(true);
    setError('');
    setSuccessMessage('');
    try {
      const organistData = {
        name: sanitizedName,
        availability,
      };

      if (editingId) {
        await updateOrganistInChurch(user.uid, id, editingId, organistData);
      } else {
        await addOrganistToChurch(user.uid, id, organistData);
      }
      if (!isMountedRef.current) return;

      handleCancelEdit();
      await fetchData();
      if (!isMountedRef.current) return;
      setSuccessMessage(
        editingId ? 'Organista atualizada com sucesso.' : 'Organista cadastrada com sucesso.'
      );
    } catch (saveError) {
      if (!isMountedRef.current) return;
      logger.error('Erro ao salvar organista:', saveError);
      setError('Erro ao salvar organista.');
    } finally {
      if (isMountedRef.current) setIsSubmitting(false);
    }
  };

  const handleRequestDeleteOrganist = (organistId, organistName) => {
    setPendingDeleteOrganist({ id: organistId, name: organistName });
  };

  const handleConfirmDeleteOrganist = async () => {
    if (!pendingDeleteOrganist) return;
    try {
      await deleteOrganistFromChurch(user.uid, id, pendingDeleteOrganist.id);
      if (!isMountedRef.current) return;
      await fetchData();
      if (!isMountedRef.current) return;
      setSuccessMessage('Organista excluída com sucesso.');
      setError('');
      if (editingId === pendingDeleteOrganist.id) handleCancelEdit();
    } catch (deleteError) {
      if (!isMountedRef.current) return;
      logger.error('Erro ao excluir organista:', deleteError);
      setError('Erro ao excluir organista.');
    } finally {
      if (isMountedRef.current) setPendingDeleteOrganist(null);
    }
  };

  const formatOrganistAvailability = useCallback((avail) => formatAvailability(avail), []);

  return {
    id,
    church,
    organists,
    loading,
    visibleDays,
    newOrganistName,
    availability,
    isSubmitting,
    editingId,
    error,
    fieldErrors,
    successMessage,
    pendingDeleteOrganist,
    setNewOrganistName,
    setPendingDeleteOrganist,
    handleOrganistNameChange,
    handleOrganistNameBlur,
    handleCheckboxChange,
    handleStartEdit,
    handleCancelEdit,
    handleSaveOrganist,
    handleRequestDeleteOrganist,
    handleConfirmDeleteOrganist,
    formatOrganistAvailability,
  };
};
