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
    <div className={`church-form ${editingId ? 'church-form--editing' : ''}`}>
      <h3 className="church-form__title">{editingId ? 'Editar Igreja' : 'Cadastrar Nova Igreja'}</h3>

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

        <div className="church-form__days">
          <label className="church-form__days-label">
            Dias de Culto:
          </label>

          <div className="church-form__days-grid">
            {ALL_WEEK_DAYS.map((day) => (
              <div key={day.key} className="church-form__day-item">
                <input
                  type="checkbox"
                  id={`day-${day.key}`}
                  checked={selectedDays[day.key]}
                  onChange={() => onDayChange(day.key)}
                  className="church-form__day-checkbox"
                />
                <label
                  htmlFor={`day-${day.key}`}
                  className="church-form__day-label"
                >
                  {day.label}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="church-form__actions">
          <Button
            type="submit"
            disabled={isSubmitting || isLoading}
            variant={editingId ? 'warning' : 'primary'}
            size="sm"
          >
            {isSubmitting ? 'Salvando...' : editingId ? 'Atualizar' : 'Cadastrar'}
          </Button>
          {editingId && (
            <Button type="button" onClick={onCancelEdit} variant="secondary" size="sm">
              Cancelar
            </Button>
          )}
        </div>
        {error && <p className="feedback feedback--error">{error}</p>}
        {successMessage && <p className="feedback feedback--success">{successMessage}</p>}
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
