import React from 'react';
import PropTypes from 'prop-types';
import { useParams, useNavigate } from 'react-router-dom';
import { useChurch } from '../contexts/ChurchContext';
import ScheduleControls from './ScheduleControls';
import ScheduleGridView from './ScheduleGridView';
import ScheduleHistoryList from './ScheduleHistoryList';
import Button from './ui/Button';
import { useChurchScheduleGenerator } from '../hooks/useChurchScheduleGenerator';

const ChurchScheduleGenerator = ({ user }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { selectedChurch } = useChurch();

  const {
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
  } = useChurchScheduleGenerator(user, selectedChurch);


  return (
    <div className="page-container page-container--xl">
      <Button onClick={() => navigate(`/igreja/${id}`)} variant="secondary" size="sm" className="mb-20">
        &larr; Voltar para Painel
      </Button>
      {isLoading && (
        <div className="alert alert--warning">
          Carregando dados da igreja...
        </div>
      )}
      <h2 className="section-title">
        Gerador de Escala: <span className="section-title__highlight">{selectedChurch?.name || 'Igreja'}</span>
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
