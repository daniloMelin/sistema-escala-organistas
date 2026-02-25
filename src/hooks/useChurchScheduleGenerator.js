import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useParams } from 'react-router-dom';
import {
  getOrganistsByChurch,
  saveScheduleToChurch,
  getChurchSchedules,
  getChurch,
} from '../services/firebaseService';
import { generateSchedule as generateScheduleLogic } from '../utils/scheduleLogic';
import { exportScheduleToPDF } from '../utils/pdfGenerator';
import { getMonthYearLabel } from '../utils/dateUtils';
import { validateDateRange } from '../utils/validation';
import logger from '../utils/logger';

export const useChurchScheduleGenerator = (user, selectedChurch) => {
  const { id } = useParams();

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [organists, setOrganists] = useState([]);
  const [generatedSchedule, setGeneratedSchedule] = useState([]);
  const [savedSchedules, setSavedSchedules] = useState([]);
  const [currentScheduleId, setCurrentScheduleId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [churchConfig, setChurchConfig] = useState(null);
  const isMountedRef = useRef(false);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const loadData = useCallback(async () => {
    if (!user || !id) return;
    if (isMountedRef.current) setIsLoading(true);
    try {
      const orgsData = await getOrganistsByChurch(user.uid, id);
      if (!isMountedRef.current) return;
      setOrganists(orgsData);

      const churchData = await getChurch(user.uid, id);
      if (!isMountedRef.current) return;
      if (churchData && churchData.config) {
        setChurchConfig(churchData.config);
      }

      const schedulesData = await getChurchSchedules(user.uid, id);
      if (!isMountedRef.current) return;
      setSavedSchedules(schedulesData);
    } catch (err) {
      if (!isMountedRef.current) return;
      logger.error('Erro ao carregar dados da igreja:', err);
      setError('Erro ao carregar dados da igreja.');
    } finally {
      if (isMountedRef.current) setIsLoading(false);
    }
  }, [id, user]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleExportClick = () => {
    const churchName = selectedChurch?.name || 'Igreja';
    try {
      exportScheduleToPDF(generatedSchedule, startDate, endDate, churchName);
    } catch (err) {
      logger.error('Erro ao exportar PDF:', err);
      setError(`Erro ao exportar PDF: ${err.message || err}`);
    }
  };

  const handleGenerate = async () => {
    if (isMountedRef.current) {
      setError('');
      setSuccessMessage('');
      setIsEditing(false);
    }

    const dateValidation = validateDateRange(startDate, endDate);
    if (!dateValidation.isValid) {
      setError(dateValidation.error);
      return;
    }
    if (organists.length === 0) {
      setError('Não há organistas cadastradas nesta igreja. Volte e cadastre.');
      return;
    }

    if (!churchConfig || Object.keys(churchConfig).length === 0) {
      setError(
        'A igreja não tem dias de culto configurados. Volte e configure os dias de culto.'
      );
      return;
    }

    setIsGenerating(true);
    try {
      const schedule = generateScheduleLogic(organists, startDate, endDate, churchConfig);
      if (schedule.length === 0) {
        if (isMountedRef.current) setError('Não foi possível gerar escala.');
        logger.error('Schedule vazio após geração.');
        return;
      }
      if (!isMountedRef.current) return;

      setGeneratedSchedule(schedule);

      const scheduleId = `escala_${startDate}_${endDate}_${Date.now()}`;
      const scheduleData = {
        period: { start: startDate, end: endDate },
        generatedAt: new Date().toISOString(),
        data: schedule,
        organistCount: organists.length,
      };

      await saveScheduleToChurch(user.uid, id, scheduleId, scheduleData);
      if (!isMountedRef.current) return;

      setCurrentScheduleId(scheduleId);
      setSuccessMessage('Escala gerada e salva com sucesso!');
      const updatedSchedules = await getChurchSchedules(user.uid, id);
      if (!isMountedRef.current) return;
      setSavedSchedules(updatedSchedules);
    } catch (err) {
      if (!isMountedRef.current) return;
      logger.error('Erro ao gerar/salvar escala:', err);
      setError('Erro ao gerar/salvar escala.');
    } finally {
      if (isMountedRef.current) setIsGenerating(false);
    }
  };

  const handleViewSaved = (scheduleData) => {
    setError('');
    setSuccessMessage('');
    setIsEditing(false);
    setGeneratedSchedule(scheduleData.data);
    if (scheduleData.period) {
      setStartDate(scheduleData.period.start);
      setEndDate(scheduleData.period.end);
    }
    setCurrentScheduleId(scheduleData.id);
    setSuccessMessage('Visualizando escala do histórico.');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAssignmentChange = (originalIndex, cultoKey, newName) => {
    const updatedSchedule = [...generatedSchedule];
    updatedSchedule[originalIndex].assignments[cultoKey] = newName;
    setGeneratedSchedule(updatedSchedule);
  };

  const handleSaveChanges = async () => {
    if (!currentScheduleId) return;
    if (isMountedRef.current) setIsGenerating(true);
    try {
      const scheduleData = {
        period: { start: startDate, end: endDate },
        generatedAt: new Date().toISOString(),
        data: generatedSchedule,
        organistCount: organists.length,
      };
      await saveScheduleToChurch(user.uid, id, currentScheduleId, scheduleData);
      if (!isMountedRef.current) return;
      setSuccessMessage('Alterações salvas com sucesso!');
      setIsEditing(false);
      const updatedSchedules = await getChurchSchedules(user.uid, id);
      if (!isMountedRef.current) return;
      setSavedSchedules(updatedSchedules);
    } catch (err) {
      if (!isMountedRef.current) return;
      logger.error('Erro ao salvar alterações da escala:', err);
      setError('Erro ao salvar as alterações.');
    } finally {
      if (isMountedRef.current) setIsGenerating(false);
    }
  };

  const groupedSchedule = useMemo(() => {
    return generatedSchedule.reduce((acc, day, index) => {
      const dayWithIndex = { ...day, originalIndex: index };
      const monthKey = getMonthYearLabel(day.date);
      if (!acc[monthKey]) acc[monthKey] = [];
      acc[monthKey].push(dayWithIndex);
      return acc;
    }, {});
  }, [generatedSchedule]);

  return {
    id,
    startDate,
    endDate,
    organists,
    generatedSchedule,
    savedSchedules,
    isEditing,
    isLoading,
    isGenerating,
    error,
    successMessage,
    groupedSchedule,
    setStartDate,
    setEndDate,
    setIsEditing,
    handleExportClick,
    handleGenerate,
    handleViewSaved,
    handleAssignmentChange,
    handleSaveChanges,
  };
};
