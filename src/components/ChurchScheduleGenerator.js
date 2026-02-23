import React, { useState, useEffect, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useParams, useNavigate } from 'react-router-dom';
import { getOrganistsByChurch, saveScheduleToChurch, getChurchSchedules, getChurch } from '../services/firebaseService';
import { generateSchedule as generateScheduleLogic } from '../utils/scheduleLogic';
import { exportScheduleToPDF } from '../utils/pdfGenerator';
import { useChurch } from '../contexts/ChurchContext';
import { getMonthYearLabel } from '../utils/dateUtils';
import { validateDateRange } from '../utils/validation';
import logger from '../utils/logger';
import ScheduleControls from './ScheduleControls';
import ScheduleGridView from './ScheduleGridView';
import ScheduleHistoryList from './ScheduleHistoryList';

const ChurchScheduleGenerator = ({ user }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { selectedChurch } = useChurch();

  // Estados
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

  const loadData = useCallback(async () => {
    if (!user || !id) return;
    setIsLoading(true);
    try {
      const orgsData = await getOrganistsByChurch(user.uid, id);
      setOrganists(orgsData);

      // Buscar dados completos da igreja incluindo a config
      const churchData = await getChurch(user.uid, id);
      if (churchData && churchData.config) {
        setChurchConfig(churchData.config);
      }

      const schedulesData = await getChurchSchedules(user.uid, id);
      setSavedSchedules(schedulesData);
    } catch (err) {
      logger.error('Erro ao carregar dados da igreja:', err);
      setError("Erro ao carregar dados da igreja.");
    } finally {
      setIsLoading(false);
    }
  }, [user, id]);

  useEffect(() => {
    loadData();
  }, [loadData]);



  // --- EXPORTAR PDF ---
  const handleExportClick = () => {
    const churchName = selectedChurch?.name || "Igreja";
    try {
      exportScheduleToPDF(generatedSchedule, startDate, endDate, churchName);
    } catch (err) {
      logger.error('Erro ao exportar PDF:', err);
      setError(`Erro ao exportar PDF: ${err.message || err}`);
    }
  };

  // --- GERAR NOVA ESCALA ---
  const handleGenerate = async () => {
    setError('');
    setSuccessMessage('');
    setIsEditing(false);

    // Validação de datas
    const dateValidation = validateDateRange(startDate, endDate);
    if (!dateValidation.isValid) {
      setError(dateValidation.error);
      return;
    }
    if (organists.length === 0) {
      setError("Não há organistas cadastradas nesta igreja. Volte e cadastre.");
      return;
    }

    if (!churchConfig || Object.keys(churchConfig).length === 0) {
      setError("A igreja não tem dias de culto configurados. Volte e configure os dias de culto.");
      return;
    }

    setIsGenerating(true);
    try {
      const schedule = generateScheduleLogic(organists, startDate, endDate, churchConfig);

      if (schedule.length === 0) {
        setError("Não foi possível gerar escala.");
        logger.error('Schedule vazio após geração.');
        setIsGenerating(false);
        return;
      }

      setGeneratedSchedule(schedule);

      const scheduleId = `escala_${startDate}_${endDate}_${Date.now()}`;
      const scheduleData = {
        period: { start: startDate, end: endDate },
        generatedAt: new Date().toISOString(),
        data: schedule,
        organistCount: organists.length
      };

      await saveScheduleToChurch(user.uid, id, scheduleId, scheduleData);

      setCurrentScheduleId(scheduleId);
      setSuccessMessage("Escala gerada e salva com sucesso!");

      const updatedSchedules = await getChurchSchedules(user.uid, id);
      setSavedSchedules(updatedSchedules);

    } catch (err) {
      logger.error('Erro ao gerar/salvar escala:', err);
      setError("Erro ao gerar/salvar escala.");
    } finally {
      setIsGenerating(false);
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
    setSuccessMessage("Visualizando escala do histórico.");
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAssignmentChange = (originalIndex, cultoKey, newName) => {
    const updatedSchedule = [...generatedSchedule];
    updatedSchedule[originalIndex].assignments[cultoKey] = newName;
    setGeneratedSchedule(updatedSchedule);
  };

  const handleSaveChanges = async () => {
    if (!currentScheduleId) return;

    setIsGenerating(true);
    try {
      const scheduleData = {
        period: { start: startDate, end: endDate },
        generatedAt: new Date().toISOString(),
        data: generatedSchedule,
        organistCount: organists.length
      };

      await saveScheduleToChurch(user.uid, id, currentScheduleId, scheduleData);
      setSuccessMessage("Alterações salvas com sucesso!");
      setIsEditing(false);

      const updatedSchedules = await getChurchSchedules(user.uid, id);
      setSavedSchedules(updatedSchedules);
    } catch (err) {
      logger.error('Erro ao salvar alterações da escala:', err);
      setError("Erro ao salvar as alterações.");
    } finally {
      setIsGenerating(false);
    }
  };

  // --- AGRUPAMENTO PARA EXIBIÇÃO ---
  // Precisamos manter o índice original para a edição funcionar
  // Usa useMemo para evitar recálculo desnecessário
  const groupedSchedule = useMemo(() => {
    return generatedSchedule.reduce((acc, day, index) => {
      // Adicionamos o índice original ao objeto do dia
      const dayWithIndex = { ...day, originalIndex: index };
      const monthKey = getMonthYearLabel(day.date);

      if (!acc[monthKey]) acc[monthKey] = [];
      acc[monthKey].push(dayWithIndex);
      return acc;
    }, {});
  }, [generatedSchedule]);


  return (
    <div style={{ padding: '20px', maxWidth: '1100px', margin: 'auto' }}>
      <button onClick={() => navigate(`/igreja/${id}`)} style={{ marginBottom: '20px', cursor: 'pointer' }}>
        &larr; Voltar para Painel
      </button>
      {isLoading && (
        <div style={{ marginBottom: '15px', padding: '10px', background: '#fff3cd', borderRadius: '4px', border: '1px solid #ffeeba' }}>
          Carregando dados da igreja...
        </div>
      )}
      <h2 style={{ borderBottom: '2px solid #eee', paddingBottom: '10px' }}>
        Gerador de Escala: <span style={{ color: '#0056b3' }}>{selectedChurch?.name || 'Igreja'}</span>
      </h2>

      {!isEditing && (
        <ScheduleControls
          startDate={startDate}
          endDate={endDate}
          isGenerating={isGenerating}
          isLoading={isLoading}
          error={error}
          successMessage={successMessage}
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
          onGenerate={handleGenerate}
        />
      )}

      {generatedSchedule.length > 0 && (
        <ScheduleGridView
          groupedSchedule={groupedSchedule}
          isEditing={isEditing}
          isGenerating={isGenerating}
          organists={organists}
          onToggleEditing={setIsEditing}
          onSaveChanges={handleSaveChanges}
          onExportClick={handleExportClick}
          onAssignmentChange={handleAssignmentChange}
        />
      )}

      <ScheduleHistoryList isEditing={isEditing} savedSchedules={savedSchedules} onViewSaved={handleViewSaved} />
    </div>
  );
};

ChurchScheduleGenerator.propTypes = {
  user: PropTypes.shape({
    uid: PropTypes.string.isRequired,
    email: PropTypes.string,
  }).isRequired,
};

export default ChurchScheduleGenerator;
