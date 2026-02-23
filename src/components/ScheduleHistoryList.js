import React from 'react';
import PropTypes from 'prop-types';

const ScheduleHistoryList = ({ isEditing, savedSchedules, onViewSaved }) => {
  if (isEditing) return null;

  return (
    <>
      <h3 style={{ marginTop: '40px', borderTop: '2px solid #eee', paddingTop: '20px' }}>Histórico de Escalas</h3>
      {savedSchedules.length === 0 && <p style={{ color: '#777' }}>Nenhuma escala salva ainda.</p>}
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {savedSchedules.map((sch) => (
          <li
            key={sch.id}
            style={{
              border: '1px solid #eee',
              padding: '15px',
              marginBottom: '10px',
              borderRadius: '4px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: 'white',
            }}
          >
            <div>
              <strong>
                {sch.period?.start ? new Date(`${sch.period.start}T00:00:00`).toLocaleDateString() : 'N/A'} até{' '}
                {sch.period?.end ? new Date(`${sch.period.end}T00:00:00`).toLocaleDateString() : 'N/A'}
              </strong>
              <br />
              <small style={{ color: '#999' }}>
                Atualizada em: {sch.generatedAt ? new Date(sch.generatedAt).toLocaleString() : 'N/A'}
              </small>
            </div>
            <button
              onClick={() => onViewSaved(sch)}
              style={{
                cursor: 'pointer',
                padding: '8px 15px',
                background: '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
              }}
            >
              Visualizar
            </button>
          </li>
        ))}
      </ul>
    </>
  );
};

ScheduleHistoryList.propTypes = {
  isEditing: PropTypes.bool.isRequired,
  savedSchedules: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      generatedAt: PropTypes.string,
      period: PropTypes.shape({
        start: PropTypes.string,
        end: PropTypes.string,
      }),
    })
  ).isRequired,
  onViewSaved: PropTypes.func.isRequired,
};

export default ScheduleHistoryList;
