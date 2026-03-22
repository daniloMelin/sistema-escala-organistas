import React from 'react';
import PropTypes from 'prop-types';
import Button from './ui/Button';

const formatSchedulePeriod = (schedule) => {
  const start = schedule.period?.start
    ? new Date(`${schedule.period.start}T00:00:00`).toLocaleDateString()
    : 'N/A';
  const end = schedule.period?.end
    ? new Date(`${schedule.period.end}T00:00:00`).toLocaleDateString()
    : 'N/A';

  return `${start} até ${end}`;
};

const getScheduleDaysLabel = (schedule) => {
  const dayCount = schedule.data?.length || 0;
  if (dayCount === 1) return '1 dia na escala';
  return `${dayCount} dias na escala`;
};

const getOrganistCountLabel = (schedule) => {
  const organistCount = schedule.organistCount || 0;
  if (organistCount === 1) return '1 organista considerada';
  return `${organistCount} organistas consideradas`;
};

const ScheduleHistoryList = ({ isEditing, savedSchedules, onViewSaved }) => {
  if (isEditing) return null;

  return (
    <>
      <h3 className="history-title">Histórico de Escalas</h3>
      {savedSchedules.length === 0 && <p className="muted-text">Nenhuma escala salva ainda.</p>}
      <ul className="list-reset">
        {savedSchedules.map((sch, index) => (
          <li key={sch.id} className={`history-item ${index === 0 ? 'history-item--latest' : ''}`}>
            <div>
              <div className="history-item__header">
                <strong>{formatSchedulePeriod(sch)}</strong>
                {index === 0 && <span className="history-item__badge">Mais recente</span>}
              </div>
              <small className="history-item__date">
                Atualizada em:{' '}
                {sch.generatedAt ? new Date(sch.generatedAt).toLocaleString() : 'N/A'}
              </small>
              <p className="history-item__summary">
                {getScheduleDaysLabel(sch)} • {getOrganistCountLabel(sch)}
              </p>
            </div>
            <Button onClick={() => onViewSaved(sch)} variant="secondary" size="sm">
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
      organistCount: PropTypes.number,
      period: PropTypes.shape({
        start: PropTypes.string,
        end: PropTypes.string,
      }),
      data: PropTypes.arrayOf(
        PropTypes.shape({
          date: PropTypes.string,
        })
      ),
    })
  ).isRequired,
  onViewSaved: PropTypes.func.isRequired,
};

export default ScheduleHistoryList;
