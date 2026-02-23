import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import {
  getOrganistsByChurch,
  addOrganistToChurch,
  deleteOrganistFromChurch,
  updateOrganistInChurch,
  getChurch,
} from '../services/firebaseService';
import {
  ALL_WEEK_DAYS,
  INITIAL_AVAILABILITY,
  formatAvailability,
} from '../constants/days';
import { validateOrganistName, sanitizeString } from '../utils/validation';
import logger from '../utils/logger';

export const useChurchDashboard = (user) => {
  const { id } = useParams();

  const [organists, setOrganists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleDays, setVisibleDays] = useState([]);
  const [newOrganistName, setNewOrganistName] = useState('');
  const [availability, setAvailability] = useState(INITIAL_AVAILABILITY);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [pendingDeleteOrganist, setPendingDeleteOrganist] = useState(null);

  const fetchData = useCallback(async () => {
    if (!user || !id) return;
    setLoading(true);
    setError('');
    try {
      const orgsData = await getOrganistsByChurch(user.uid, id);
      setOrganists(orgsData);

      const churchData = await getChurch(user.uid, id);
      if (churchData && churchData.config) {
        const config = churchData.config;
        const filteredDays = ALL_WEEK_DAYS.filter((dayObj) => {
          if (dayObj.key === 'sunday_rjm') {
            return config.sunday && config.sunday.some((s) => s.id === 'RJM');
          }
          if (dayObj.key === 'sunday_culto') {
            return config.sunday && config.sunday.some((s) => s.id === 'Culto');
          }
          return Object.prototype.hasOwnProperty.call(config, dayObj.key);
        });
        setVisibleDays(filteredDays);
      } else {
        setVisibleDays(ALL_WEEK_DAYS);
      }
      setError('');
    } catch (fetchError) {
      logger.error('Erro ao carregar dados:', fetchError);
      setError('Falha ao carregar dados da igreja.');
    } finally {
      setLoading(false);
    }
  }, [id, user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setAvailability((prev) => ({ ...prev, [name]: checked }));
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

    const nameValidation = validateOrganistName(newOrganistName);
    if (!nameValidation.isValid) {
      setError(nameValidation.error);
      return;
    }

    if (!user || !id) {
      setError('Erro de identificação.');
      return;
    }

    setIsSubmitting(true);
    setError('');
    setSuccessMessage('');
    try {
      const organistData = {
        name: sanitizeString(newOrganistName),
        availability,
      };

      if (editingId) {
        await updateOrganistInChurch(user.uid, id, editingId, organistData);
      } else {
        await addOrganistToChurch(user.uid, id, organistData);
      }

      handleCancelEdit();
      await fetchData();
      setSuccessMessage(
        editingId
          ? 'Organista atualizada com sucesso.'
          : 'Organista cadastrada com sucesso.'
      );
    } catch (saveError) {
      logger.error('Erro ao salvar organista:', saveError);
      setError('Erro ao salvar organista.');
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
    } catch (deleteError) {
      logger.error('Erro ao excluir organista:', deleteError);
      setError('Erro ao excluir organista.');
    } finally {
      setPendingDeleteOrganist(null);
    }
  };

  const formatOrganistAvailability = useCallback((avail) => formatAvailability(avail), []);

  return {
    id,
    organists,
    loading,
    visibleDays,
    newOrganistName,
    availability,
    isSubmitting,
    editingId,
    error,
    successMessage,
    pendingDeleteOrganist,
    setNewOrganistName,
    setPendingDeleteOrganist,
    handleCheckboxChange,
    handleStartEdit,
    handleCancelEdit,
    handleSaveOrganist,
    handleRequestDeleteOrganist,
    handleConfirmDeleteOrganist,
    formatOrganistAvailability,
  };
};

