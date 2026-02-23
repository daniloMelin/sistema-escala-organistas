import React from 'react';
import PropTypes from 'prop-types';
import Button from './ui/Button';

const ScheduleHistoryList = ({ isEditing, savedSchedules, onViewSaved }) => {
  if (isEditing) return null;

  return (
    <>
      <h3 className="history-title">Histórico de Escalas</h3>
      {savedSchedules.length === 0 && <p className="muted-text">Nenhuma escala salva ainda.</p>}
      <ul className="list-reset">
        {savedSchedules.map((sch) => (
          <li key={sch.id} className="history-item">
            <div>
              <strong>
                {sch.period?.start ? new Date(`${sch.period.start}T00:00:00`).toLocaleDateString() : 'N/A'} até{' '}
                {sch.period?.end ? new Date(`${sch.period.end}T00:00:00`).toLocaleDateString() : 'N/A'}
              </strong>
              <br />
              <small className="history-item__date">
                Atualizada em: {sch.generatedAt ? new Date(sch.generatedAt).toLocaleString() : 'N/A'}
              </small>
            </div>
            <Button
              onClick={() => onViewSaved(sch)}
              variant="secondary"
              size="sm"
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
