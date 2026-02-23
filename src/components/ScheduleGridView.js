import React from 'react';
import PropTypes from 'prop-types';
import Button from './ui/Button';

const ScheduleGridView = ({
  groupedSchedule,
  isEditing,
  isGenerating,
  organists,
  onToggleEditing,
  onSaveChanges,
  onExportClick,
  onAssignmentChange,
}) => {
  if (Object.keys(groupedSchedule).length === 0) return null;

  return (
    <div className="schedule-grid">
      <div className="schedule-grid__toolbar">
        <h3 className="schedule-grid__title">{isEditing ? '✏️ Editando Escala' : 'Visualização da Escala'}</h3>

        <div className="actions-row">
          {isEditing ? (
            <>
              <Button
                onClick={() => onToggleEditing(false)}
                variant="secondary"
                size="sm"
              >
                Cancelar
              </Button>
              <Button
                onClick={onSaveChanges}
                disabled={isGenerating}
                variant="success"
                size="sm"
              >
                {isGenerating ? 'Salvando...' : 'Salvar Alterações'}
              </Button>
            </>
          ) : (
            <>
              <Button
                onClick={() => onToggleEditing(true)}
                variant="warning"
                size="sm"
              >
                ✏️ Editar Manualmente
              </Button>
              <Button
                onClick={onExportClick}
                variant="info"
                size="sm"
              >
                📥 Baixar PDF
              </Button>
            </>
          )}
        </div>
      </div>

      {Object.entries(groupedSchedule).map(([monthLabel, days]) => (
        <div key={monthLabel} className="schedule-grid__month">
          <div className="schedule-grid__month-header">
            {monthLabel.toUpperCase()}
          </div>

          <div className="schedule-grid__cards">
            {days.map((day) => {
              const hasAssignments = Object.values(day.assignments).some((v) => v && v !== 'VAGO');
              if (!hasAssignments && !isEditing) return null;

              return (
                <div key={day.date} className="schedule-card">
                  <div className="schedule-card__header">
                    {day.dayName}, {day.date}
                  </div>

                  <div className="schedule-card__body">
                    <ul className="list-reset">
                      {Object.entries(day.assignments).map(([culto, nome]) => (
                        <li key={culto} className="schedule-card__row">
                          <span className="schedule-card__role">{culto}:</span>

                          {isEditing ? (
                            <select
                              value={nome}
                              onChange={(e) => onAssignmentChange(day.originalIndex, culto, e.target.value)}
                              className="schedule-card__select"
                            >
                              <option value="VAGO">VAGO</option>
                              {organists.map((org) => (
                                <option key={org.id} value={org.name}>
                                  {org.name}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <span className={nome === 'VAGO' ? 'schedule-card__name schedule-card__name--empty' : 'schedule-card__name'}>
                              {nome}
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

ScheduleGridView.propTypes = {
  groupedSchedule: PropTypes.object.isRequired,
  isEditing: PropTypes.bool.isRequired,
  isGenerating: PropTypes.bool.isRequired,
  organists: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
  onToggleEditing: PropTypes.func.isRequired,
  onSaveChanges: PropTypes.func.isRequired,
  onExportClick: PropTypes.func.isRequired,
  onAssignmentChange: PropTypes.func.isRequired,
};

export default ScheduleGridView;
