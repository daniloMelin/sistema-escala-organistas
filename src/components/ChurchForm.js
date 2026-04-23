import React from 'react';
import PropTypes from 'prop-types';
import { ALL_WEEK_DAYS } from '../constants/days';
import {
  REHEARSAL_TIME_OPTIONS,
  REHEARSAL_WEEK_OPTIONS,
  REHEARSAL_WEEKDAY_OPTIONS,
} from '../constants/rehearsal';
import { CULT_MODEL_OPTIONS } from '../utils/churchCultModel';
import Button from './ui/Button';
import Input from './ui/Input';

const ChurchForm = ({
  editingId,
  churchName,
  selectedDays,
  cultoModel,
  rehearsal,
  isSubmitting,
  isLoading,
  error,
  fieldErrors,
  successMessage,
  onChurchNameChange,
  onChurchNameBlur,
  onCultoModelChange,
  onRehearsalChange,
  onRehearsalBlur,
  onDayChange,
  onSubmit,
  onCancelEdit,
}) => {
  const getSelectClassName = (hasError) =>
    ['church-form__model-select', hasError ? 'church-form__model-select--error' : '']
      .join(' ')
      .trim();

  return (
    <div className={`church-form ${editingId ? 'church-form--editing' : ''}`}>
      <h3 className="church-form__title">
        {editingId ? 'Editar Igreja' : 'Cadastrar Nova Igreja'}
      </h3>

      <form onSubmit={onSubmit}>
        <Input
          label="Nome da Congregação:"
          type="text"
          value={churchName}
          onChange={(e) => onChurchNameChange(e.target.value)}
          onBlur={onChurchNameBlur}
          error={fieldErrors.churchName}
          maxLength={100}
          required
        />

        <div className="church-form__model">
          <label htmlFor="church-cult-model" className="church-form__days-label">
            Modelo de culto:
          </label>

          <select
            id="church-cult-model"
            value={cultoModel}
            onChange={(e) => onCultoModelChange(e.target.value)}
            className="church-form__model-select"
          >
            {CULT_MODEL_OPTIONS.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>

          <p className="church-form__model-help">
            {CULT_MODEL_OPTIONS.find((option) => option.id === cultoModel)?.description}
          </p>
        </div>

        <div className="church-form__days">
          <label className="church-form__days-label">Dias de Culto:</label>

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
                <label htmlFor={`day-${day.key}`} className="church-form__day-label">
                  {day.label}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="church-form__rehearsal">
          <label className="church-form__days-label">Ensaio Local:</label>

          <div className="church-form__rehearsal-grid">
            <div className="church-form__rehearsal-field">
              <label htmlFor="church-rehearsal-week" className="church-form__days-label">
                Semana do mês:
              </label>
              <select
                id="church-rehearsal-week"
                value={rehearsal.weekOfMonth}
                onChange={(e) => onRehearsalChange('weekOfMonth', e.target.value)}
                onBlur={() => onRehearsalBlur('weekOfMonth')}
                className={getSelectClassName(Boolean(fieldErrors.rehearsalWeekOfMonth))}
              >
                {REHEARSAL_WEEK_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {fieldErrors.rehearsalWeekOfMonth && (
                <p className="church-form__field-error">{fieldErrors.rehearsalWeekOfMonth}</p>
              )}
            </div>

            <div className="church-form__rehearsal-field">
              <label htmlFor="church-rehearsal-weekday" className="church-form__days-label">
                Dia da semana:
              </label>
              <select
                id="church-rehearsal-weekday"
                value={rehearsal.weekday}
                onChange={(e) => onRehearsalChange('weekday', e.target.value)}
                onBlur={() => onRehearsalBlur('weekday')}
                className={getSelectClassName(Boolean(fieldErrors.rehearsalWeekday))}
              >
                {REHEARSAL_WEEKDAY_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {fieldErrors.rehearsalWeekday && (
                <p className="church-form__field-error">{fieldErrors.rehearsalWeekday}</p>
              )}
            </div>

            <div className="church-form__rehearsal-field">
              <label htmlFor="church-rehearsal-time" className="church-form__days-label">
                Horário:
              </label>
              <select
                id="church-rehearsal-time"
                value={rehearsal.time}
                onChange={(e) => onRehearsalChange('time', e.target.value)}
                onBlur={() => onRehearsalBlur('time')}
                className={getSelectClassName(Boolean(fieldErrors.rehearsalTime))}
              >
                <option value="">Selecione o horário</option>
                {REHEARSAL_TIME_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {fieldErrors.rehearsalTime && (
                <p className="church-form__field-error">{fieldErrors.rehearsalTime}</p>
              )}
            </div>

            <div className="church-form__rehearsal-field church-form__rehearsal-field--notes">
              <Input
                id="church-rehearsal-notes"
                label="Observação (opcional):"
                type="text"
                value={rehearsal.notes}
                onChange={(e) => onRehearsalChange('notes', e.target.value)}
                onBlur={() => onRehearsalBlur('notes')}
                error={fieldErrors.rehearsalNotes}
                maxLength={120}
              />
            </div>
          </div>
        </div>

        <div className="church-form__actions">
          <Button
            type="submit"
            disabled={isSubmitting || isLoading}
            variant={editingId ? 'warning' : 'primary'}
            size="sm"
          >
            {isSubmitting ? 'Salvando...' : editingId ? 'Atualizar' : 'Cadastrar Igreja'}
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
  selectedDays: PropTypes.object.isRequired,
  cultoModel: PropTypes.string.isRequired,
  rehearsal: PropTypes.shape({
    weekOfMonth: PropTypes.string.isRequired,
    weekday: PropTypes.string.isRequired,
    time: PropTypes.string.isRequired,
    notes: PropTypes.string.isRequired,
  }).isRequired,
  isSubmitting: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool.isRequired,
  error: PropTypes.string.isRequired,
  fieldErrors: PropTypes.shape({
    churchName: PropTypes.string.isRequired,
    rehearsalWeekOfMonth: PropTypes.string.isRequired,
    rehearsalWeekday: PropTypes.string.isRequired,
    rehearsalTime: PropTypes.string.isRequired,
    rehearsalNotes: PropTypes.string.isRequired,
  }).isRequired,
  successMessage: PropTypes.string.isRequired,
  onChurchNameChange: PropTypes.func.isRequired,
  onChurchNameBlur: PropTypes.func.isRequired,
  onCultoModelChange: PropTypes.func.isRequired,
  onRehearsalChange: PropTypes.func.isRequired,
  onRehearsalBlur: PropTypes.func.isRequired,
  onDayChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onCancelEdit: PropTypes.func.isRequired,
};

export default ChurchForm;
