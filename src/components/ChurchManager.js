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
    isSubmitting,
    editingId,
    error,
    loadError,
    successMessage,
    pendingDeleteChurch,
    setChurchName,
    setChurchCode,
    setPendingDeleteChurch,
    handleStartEdit,
    handleCancelEdit,
    handleDayChange,
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
        isSubmitting={isSubmitting}
        isLoading={isLoading}
        error={error}
        successMessage={successMessage}
        onChurchNameChange={setChurchName}
        onChurchCodeChange={setChurchCode}
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
