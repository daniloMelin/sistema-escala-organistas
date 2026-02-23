import React from 'react';
import PropTypes from 'prop-types';
import Button from './ui/Button';
import Input from './ui/Input';

const OrganistForm = ({
  editingId,
  newOrganistName,
  isSubmitting,
  error,
  successMessage,
  visibleDays,
  availability,
  onNameChange,
  onCheckboxChange,
  onSubmit,
  onCancelEdit,
}) => {
  return (
    <div className={`organist-form ${editingId ? 'organist-form--editing' : ''}`}>
      <h4 className="organist-form__title">
        {editingId ? `Editando: ${newOrganistName}` : 'Cadastrar Nova Organista'}
      </h4>

      <form onSubmit={onSubmit}>
        {error && <p className="feedback feedback--error feedback--tight">{error}</p>}
        {successMessage && (
          <p className="feedback feedback--success feedback--tight">{successMessage}</p>
        )}
        <Input
          label="Nome da Organista:"
          type="text"
          value={newOrganistName}
          onChange={(e) => onNameChange(e.target.value)}
          required
          disabled={isSubmitting}
        />

        <div className="organist-form__availability">
          <label className="organist-form__availability-label">
            Disponibilidade (Baseado nos dias de culto desta igreja):
          </label>

          {visibleDays.length === 0 ? (
            <p className="feedback feedback--warn feedback--italic">
              Nenhum dia de culto configurado para esta igreja. Va em "Minhas Igrejas" e edite as
              configuracoes.
            </p>
          ) : (
            <div className="organist-form__days">
              {visibleDays.map((day) => (
                <div key={day.key} className="organist-form__day-item">
                  <input
                    type="checkbox"
                    id={day.key}
                    name={day.key}
                    checked={availability[day.key]}
                    onChange={onCheckboxChange}
                    disabled={isSubmitting}
                  />
                  <label htmlFor={day.key} className="organist-form__day-label">
                    {day.label}
                  </label>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="organist-form__actions">
          <Button type="submit" disabled={isSubmitting} variant={editingId ? 'warning' : 'success'} className="organist-form__submit">
            {isSubmitting ? 'Salvando...' : editingId ? 'Atualizar Organista' : 'Cadastrar Organista'}
          </Button>

          {editingId && (
            <Button type="button" onClick={onCancelEdit} disabled={isSubmitting} variant="secondary" size="sm">
              Cancelar
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};

OrganistForm.propTypes = {
  editingId: PropTypes.string,
  newOrganistName: PropTypes.string.isRequired,
  isSubmitting: PropTypes.bool.isRequired,
  error: PropTypes.string.isRequired,
  successMessage: PropTypes.string.isRequired,
  visibleDays: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  availability: PropTypes.object.isRequired,
  onNameChange: PropTypes.func.isRequired,
  onCheckboxChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onCancelEdit: PropTypes.func.isRequired,
};

export default OrganistForm;
