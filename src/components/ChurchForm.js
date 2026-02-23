import React from 'react';
import PropTypes from 'prop-types';
import { ALL_WEEK_DAYS } from '../constants/days';
import Button from './ui/Button';
import Input from './ui/Input';

const ChurchForm = ({
  editingId,
  churchName,
  churchCode,
  selectedDays,
  isSubmitting,
  isLoading,
  error,
  successMessage,
  onChurchNameChange,
  onChurchCodeChange,
  onDayChange,
  onSubmit,
  onCancelEdit,
}) => {
  return (
    <div
      style={{
        marginBottom: '30px',
        padding: '20px',
        border: '1px solid #ccc',
        borderRadius: '8px',
        background: editingId ? '#fff3cd' : '#fff',
      }}
    >
      <h3 style={{ marginTop: 0 }}>{editingId ? 'Editar Igreja' : 'Cadastrar Nova Igreja'}</h3>

      <form onSubmit={onSubmit}>
        <Input
          label="Nome da Congregação:"
          type="text"
          value={churchName}
          onChange={(e) => onChurchNameChange(e.target.value)}
          required
        />
        <Input
          label="Código (opcional):"
          type="text"
          value={churchCode}
          onChange={(e) => onChurchCodeChange(e.target.value)}
        />

        <div
          style={{
            marginBottom: '20px',
            background: '#f9f9f9',
            padding: '15px',
            borderRadius: '4px',
            border: '1px solid #eee',
          }}
        >
          <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '10px' }}>
            Dias de Culto:
          </label>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
              gap: '10px',
            }}
          >
            {ALL_WEEK_DAYS.map((day) => (
              <div
                key={day.key}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  background: 'white',
                  padding: '5px',
                  borderRadius: '4px',
                  border: '1px solid #e0e0e0',
                }}
              >
                <input
                  type="checkbox"
                  id={`day-${day.key}`}
                  checked={selectedDays[day.key]}
                  onChange={() => onDayChange(day.key)}
                  style={{ cursor: 'pointer' }}
                />
                <label
                  htmlFor={`day-${day.key}`}
                  style={{ marginLeft: '6px', cursor: 'pointer', fontSize: '0.9em' }}
                >
                  {day.label}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <Button
            type="submit"
            disabled={isSubmitting || isLoading}
            variant={editingId ? 'warning' : 'primary'}
            style={{ fontSize: '14px' }}
          >
            {isSubmitting ? 'Salvando...' : editingId ? 'Atualizar' : 'Cadastrar'}
          </Button>
          {editingId && (
            <Button type="button" onClick={onCancelEdit} variant="secondary" style={{ fontSize: '14px' }}>
              Cancelar
            </Button>
          )}
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
      </form>
    </div>
  );
};

ChurchForm.propTypes = {
  editingId: PropTypes.string,
  churchName: PropTypes.string.isRequired,
  churchCode: PropTypes.string.isRequired,
  selectedDays: PropTypes.object.isRequired,
  isSubmitting: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool.isRequired,
  error: PropTypes.string.isRequired,
  successMessage: PropTypes.string.isRequired,
  onChurchNameChange: PropTypes.func.isRequired,
  onChurchCodeChange: PropTypes.func.isRequired,
  onDayChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onCancelEdit: PropTypes.func.isRequired,
};

export default ChurchForm;
