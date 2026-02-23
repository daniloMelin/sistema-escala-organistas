import React from 'react';
import PropTypes from 'prop-types';
import Button from './ui/Button';

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
            <Button
              onClick={() => onViewSaved(sch)}
              variant="secondary"
              style={{ padding: '8px 15px', fontSize: '14px' }}
            >
              Visualizar
            </Button>
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
