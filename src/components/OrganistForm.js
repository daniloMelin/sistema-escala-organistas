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
    <div
      style={{
        background: editingId ? '#fff3cd' : '#f8f9fa',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '30px',
        border: editingId ? '1px solid #ffeeba' : '1px solid #ddd',
      }}
    >
      <h4 style={{ marginTop: 0, borderBottom: '1px solid #ccc', paddingBottom: '10px' }}>
        {editingId ? `Editando: ${newOrganistName}` : 'Cadastrar Nova Organista'}
      </h4>

      <form onSubmit={onSubmit}>
        {error && <p style={{ color: 'red', marginTop: 0, marginBottom: '12px' }}>{error}</p>}
        {successMessage && (
          <p style={{ color: 'green', marginTop: 0, marginBottom: '12px' }}>{successMessage}</p>
        )}
        <Input
          label="Nome da Organista:"
          type="text"
          value={newOrganistName}
          onChange={(e) => onNameChange(e.target.value)}
          required
          disabled={isSubmitting}
          style={{ padding: '10px' }}
        />

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'normal' }}>
            Disponibilidade (Baseado nos dias de culto desta igreja):
          </label>

          {visibleDays.length === 0 ? (
            <p style={{ color: 'orange', fontStyle: 'italic' }}>
              Nenhum dia de culto configurado para esta igreja. Va em "Minhas Igrejas" e edite as
              configuracoes.
            </p>
          ) : (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {visibleDays.map((day) => (
                <div
                  key={day.key}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    background: 'white',
                    padding: '8px 12px',
                    borderRadius: '4px',
                    border: '1px solid #ccc',
                  }}
                >
                  <input
                    type="checkbox"
                    id={day.key}
                    name={day.key}
                    checked={availability[day.key]}
                    onChange={onCheckboxChange}
                    disabled={isSubmitting}
                  />
                  <label htmlFor={day.key} style={{ cursor: 'pointer', fontSize: '0.9em' }}>
                    {day.label}
                  </label>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <Button type="submit" disabled={isSubmitting} variant={editingId ? 'warning' : 'success'} style={{ flex: 1 }}>
            {isSubmitting ? 'Salvando...' : editingId ? 'Atualizar Organista' : 'Cadastrar Organista'}
          </Button>

          {editingId && (
            <Button type="button" onClick={onCancelEdit} disabled={isSubmitting} variant="secondary" style={{ fontSize: '14px' }}>
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
