import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import Button from './ui/Button';
import Input from './ui/Input';

const formatSchedulePeriod = (schedule) => {
  const start = schedule.period?.start
    ? new Date(`${schedule.period.start}T00:00:00`).toLocaleDateString('pt-BR')
    : 'N/A';
  const end = schedule.period?.end
    ? new Date(`${schedule.period.end}T00:00:00`).toLocaleDateString('pt-BR')
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
  const [searchTerm, setSearchTerm] = useState('');

  if (isEditing) return null;

  const normalizedSearchTerm = searchTerm.trim().toLocaleLowerCase('pt-BR');
  const filteredSchedules = useMemo(() => {
    if (!normalizedSearchTerm) return savedSchedules;

    return savedSchedules.filter((schedule) => {
      const searchIndex = [
        formatSchedulePeriod(schedule),
        schedule.generatedAt ? new Date(schedule.generatedAt).toLocaleString('pt-BR') : '',
        getScheduleDaysLabel(schedule),
        getOrganistCountLabel(schedule),
      ]
        .join(' ')
        .toLocaleLowerCase('pt-BR');

      return searchIndex.includes(normalizedSearchTerm);
    });
  }, [normalizedSearchTerm, savedSchedules]);

  return (
    <>
      <h3 className="history-title">Histórico de Escalas</h3>
      {savedSchedules.length === 0 && <p className="muted-text">Nenhuma escala salva ainda.</p>}
      {savedSchedules.length > 0 && (
        <div className="history-search">
          <Input
            id="schedule-history-search"
            label="Buscar no histórico:"
            type="search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Ex.: 02/03/2026, 2 dias, organistas"
            size="sm"
          />
        </div>
      )}
      {savedSchedules.length > 0 && filteredSchedules.length === 0 && (
        <p className="muted-text">Nenhuma escala encontrada para a busca informada.</p>
      )}
      <ul className="list-reset">
        {filteredSchedules.map((sch, index) => (
          <li key={sch.id} className={`history-item ${index === 0 ? 'history-item--latest' : ''}`}>
            <div>
              <div className="history-item__header">
                <strong>{formatSchedulePeriod(sch)}</strong>
                {index === 0 && <span className="history-item__badge">Mais recente</span>}
              </div>
              <small className="history-item__date">
                Atualizada em:{' '}
                {sch.generatedAt ? new Date(sch.generatedAt).toLocaleString('pt-BR') : 'N/A'}
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
