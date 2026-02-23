import React from 'react';
import PropTypes from 'prop-types';

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
    <div style={{ marginBottom: '40px' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '15px',
          background: '#eee',
          padding: '10px',
          borderRadius: '4px',
        }}
      >
        <h3 style={{ margin: 0 }}>{isEditing ? '✏️ Editando Escala' : 'Visualização da Escala'}</h3>

        <div style={{ display: 'flex', gap: '10px' }}>
          {isEditing ? (
            <>
              <button
                onClick={() => onToggleEditing(false)}
                style={{
                  background: '#6c757d',
                  color: 'white',
                  border: 'none',
                  padding: '8px 15px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                Cancelar
              </button>
              <button
                onClick={onSaveChanges}
                disabled={isGenerating}
                style={{
                  background: '#28a745',
                  color: 'white',
                  border: 'none',
                  padding: '8px 15px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                }}
              >
                {isGenerating ? 'Salvando...' : 'Salvar Alterações'}
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => onToggleEditing(true)}
                style={{
                  background: '#ffc107',
                  color: '#333',
                  border: 'none',
                  padding: '8px 15px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                }}
              >
                ✏️ Editar Manualmente
              </button>
              <button
                onClick={onExportClick}
                style={{
                  background: '#17a2b8',
                  color: 'white',
                  border: 'none',
                  padding: '8px 15px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                }}
              >
                📥 Baixar PDF
              </button>
            </>
          )}
        </div>
      </div>

      {Object.entries(groupedSchedule).map(([monthLabel, days]) => (
        <div key={monthLabel} style={{ marginBottom: '30px' }}>
          <div
            style={{
              background: '#e0e0e0',
              padding: '8px',
              textAlign: 'center',
              fontWeight: 'bold',
              borderRadius: '4px',
              marginBottom: '10px',
              color: '#555',
            }}
          >
            {monthLabel.toUpperCase()}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '15px' }}>
            {days.map((day) => {
              const hasAssignments = Object.values(day.assignments).some((v) => v && v !== 'VAGO');
              if (!hasAssignments && !isEditing) return null;

              return (
                <div
                  key={day.date}
                  style={{
                    border: '1px solid #ccc',
                    borderRadius: '6px',
                    overflow: 'hidden',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
                    background: 'white',
                  }}
                >
                  <div
                    style={{
                      background: '#f0f0f0',
                      padding: '8px',
                      textAlign: 'center',
                      fontWeight: 'bold',
                      borderBottom: '1px solid #eee',
                    }}
                  >
                    {day.dayName}, {day.date}
                  </div>

                  <div style={{ padding: '15px' }}>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                      {Object.entries(day.assignments).map(([culto, nome]) => (
                        <li
                          key={culto}
                          style={{
                            marginBottom: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            fontSize: '0.95em',
                          }}
                        >
                          <span style={{ color: '#666', fontWeight: 'bold' }}>{culto}:</span>

                          {isEditing ? (
                            <select
                              value={nome}
                              onChange={(e) => onAssignmentChange(day.originalIndex, culto, e.target.value)}
                              style={{ padding: '4px', borderRadius: '4px', borderColor: '#ccc', maxWidth: '150px' }}
                            >
                              <option value="VAGO">VAGO</option>
                              {organists.map((org) => (
                                <option key={org.id} value={org.name}>
                                  {org.name}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <span style={{ color: nome === 'VAGO' ? 'red' : '#333', fontWeight: nome === 'VAGO' ? 'bold' : 'normal' }}>
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
