import React from 'react';
import PropTypes from 'prop-types';
import Button from './ui/Button';
import Input from './ui/Input';

const ScheduleControls = ({
  startDate,
  endDate,
  isGenerating,
  isLoading,
  error,
  successMessage,
  onStartDateChange,
  onEndDateChange,
  onGenerate,
}) => {
  return (
    <div className="schedule-controls">
      <div className="schedule-controls__row">
        <Input
          id="schedule-start-date"
          label="Data Início:"
          type="date"
          value={startDate}
          onChange={(e) => onStartDateChange(e.target.value)}
          size="sm"
        />
        <Input
          id="schedule-end-date"
          label="Data Fim:"
          type="date"
          value={endDate}
          onChange={(e) => onEndDateChange(e.target.value)}
          size="sm"
        />
        <Button
          onClick={onGenerate}
          disabled={isGenerating || isLoading}
          variant="primary"
          className="schedule-controls__generate"
        >
          {isGenerating ? 'Gerando...' : 'Gerar Nova Escala'}
        </Button>
      </div>

      {error && (
        <p className="feedback feedback--error feedback--box">
          {error}
        </p>
      )}
      {successMessage && (
        <p className="feedback feedback--success feedback--box">
          {successMessage}
        </p>
      )}
    </div>
  );
};

ScheduleControls.propTypes = {
  startDate: PropTypes.string.isRequired,
  endDate: PropTypes.string.isRequired,
  isGenerating: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool.isRequired,
  error: PropTypes.string.isRequired,
  successMessage: PropTypes.string.isRequired,
  onStartDateChange: PropTypes.func.isRequired,
  onEndDateChange: PropTypes.func.isRequired,
  onGenerate: PropTypes.func.isRequired,
};

export default ScheduleControls;
