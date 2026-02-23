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
    <div
      style={{
        background: '#f8f9fa',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '30px',
        border: '1px solid #ddd',
      }}
    >
      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
        <Input
          id="schedule-start-date"
          label="Data Início:"
          type="date"
          value={startDate}
          onChange={(e) => onStartDateChange(e.target.value)}
          style={{ padding: '8px', fontSize: '14px' }}
        />
        <Input
          id="schedule-end-date"
          label="Data Fim:"
          type="date"
          value={endDate}
          onChange={(e) => onEndDateChange(e.target.value)}
          style={{ padding: '8px', fontSize: '14px' }}
        />
        <Button
          onClick={onGenerate}
          disabled={isGenerating || isLoading}
          variant="primary"
          style={{ marginBottom: '15px' }}
        >
          {isGenerating ? 'Gerando...' : 'Gerar Nova Escala'}
        </Button>
      </div>

      {error && (
        <p style={{ color: 'red', marginTop: '10px', background: '#ffd2d2', padding: '10px', borderRadius: '4px' }}>
          {error}
        </p>
      )}
      {successMessage && (
        <p style={{ color: 'green', marginTop: '10px', background: '#d4edda', padding: '10px', borderRadius: '4px' }}>
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
