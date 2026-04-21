import React from 'react';
import PropTypes from 'prop-types';
import ConfirmDialog from './ui/ConfirmDialog';
import ChurchForm from './ChurchForm';
import ChurchList from './ChurchList';
import Button from './ui/Button';
import { useChurchManager } from '../hooks/useChurchManager';
import './ChurchManager.css';

const ChurchManager = ({ user }) => {
  const {
    churches,
    isLoading,
    churchName,
    churchCode,
    selectedDays,
    cultoModel,
    rehearsal,
    isSubmitting,
    editingId,
    error,
    fieldErrors,
    loadError,
    successMessage,
    pendingDeleteChurch,
    setChurchName,
    setChurchCode,
    setCultoModel,
    setPendingDeleteChurch,
    handleChurchNameChange,
    handleChurchNameBlur,
    handleChurchCodeChange,
    handleChurchCodeBlur,
    handleStartEdit,
    handleCancelEdit,
    handleDayChange,
    handleRehearsalChange,
    handleRehearsalBlur,
    handleSubmit,
    handleRequestDeleteChurch,
    handleConfirmDeleteChurch,
    handleChurchSelect,
    handleRetryLoadChurches,
  } = useChurchManager(user);

  const hasLoadError = loadError === 'Falha ao carregar as igrejas.';

  return (
    <div className="page-container page-container--md">
      <h2>Gerenciamento de Igrejas</h2>
      {isLoading && <div className="alert alert--warning">Carregando dados da igreja...</div>}
      {hasLoadError && !isLoading && (
        <div className="alert alert--danger">
          <p>{loadError}</p>
          <Button onClick={handleRetryLoadChurches} variant="secondary" size="sm">
            Tentar novamente
          </Button>
        </div>
      )}

      <ChurchForm
        editingId={editingId}
        churchName={churchName}
        churchCode={churchCode}
        selectedDays={selectedDays}
        cultoModel={cultoModel}
        rehearsal={rehearsal}
        isSubmitting={isSubmitting}
        isLoading={isLoading}
        error={error}
        fieldErrors={fieldErrors}
        successMessage={successMessage}
        onChurchNameChange={handleChurchNameChange}
        onChurchNameBlur={handleChurchNameBlur}
        onChurchCodeChange={handleChurchCodeChange}
        onChurchCodeBlur={handleChurchCodeBlur}
        onCultoModelChange={setCultoModel}
        onRehearsalChange={handleRehearsalChange}
        onRehearsalBlur={handleRehearsalBlur}
        onDayChange={handleDayChange}
        onSubmit={handleSubmit}
        onCancelEdit={handleCancelEdit}
      />
      <ChurchList
        churches={churches}
        isLoading={isLoading}
        hasLoadError={hasLoadError}
        onChurchSelect={handleChurchSelect}
        onStartEdit={handleStartEdit}
        onRequestDeleteChurch={handleRequestDeleteChurch}
      />
      <ConfirmDialog
        isOpen={Boolean(pendingDeleteChurch)}
        title="Excluir igreja"
        message={
          pendingDeleteChurch
            ? `Tem certeza que deseja excluir a igreja "${pendingDeleteChurch.name}"?\n\nATENÇÃO: Todas as organistas e escalas desta igreja serão perdidas para sempre.`
            : ''
        }
        confirmText="Excluir"
        cancelText="Cancelar"
        isDanger
        onConfirm={handleConfirmDeleteChurch}
        onCancel={() => setPendingDeleteChurch(null)}
      />
    </div>
  );
};

ChurchManager.propTypes = {
  user: PropTypes.shape({
    uid: PropTypes.string.isRequired,
    email: PropTypes.string,
  }).isRequired,
};

export default ChurchManager;
