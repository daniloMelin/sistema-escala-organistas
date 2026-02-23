import React from 'react';
import PropTypes from 'prop-types';

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
        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Data Início:</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => onStartDateChange(e.target.value)}
            style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Data Fim:</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => onEndDateChange(e.target.value)}
            style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
        </div>
        <button
          onClick={onGenerate}
          disabled={isGenerating || isLoading}
          style={{
            padding: '10px 20px',
            background: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: isGenerating ? 'wait' : 'pointer',
            fontWeight: 'bold',
          }}
        >
          {isGenerating ? 'Gerando...' : 'Gerar Nova Escala'}
        </button>
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
