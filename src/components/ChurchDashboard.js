import React from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { useChurch } from '../contexts/ChurchContext';
import ConfirmDialog from './ui/ConfirmDialog';
import Button from './ui/Button';
import OrganistForm from './OrganistForm';
import OrganistList from './OrganistList';
import { useChurchDashboard } from '../hooks/useChurchDashboard';

const ChurchDashboard = ({ user }) => {
  const navigate = useNavigate();
  const { selectedChurch } = useChurch();
  const {
    id,
    organists,
    loading,
    visibleDays,
    newOrganistName,
    availability,
    isSubmitting,
    editingId,
    error,
    successMessage,
    pendingDeleteOrganist,
    setNewOrganistName,
    setPendingDeleteOrganist,
    handleCheckboxChange,
    handleStartEdit,
    handleCancelEdit,
    handleSaveOrganist,
    handleRequestDeleteOrganist,
    handleConfirmDeleteOrganist,
    formatOrganistAvailability,
  } = useChurchDashboard(user);

  if (!user) return <div className="page-loading">Carregando...</div>;

  return (
    <div className="page-container page-container--lg">
      <div className="dashboard-toolbar">
        <Button onClick={() => navigate('/')} variant="secondary" size="sm">
          &larr; Voltar para Igrejas
        </Button>
        <Button
          onClick={() => navigate(`/igreja/${id}/escala`)}
          variant="primary"
          className="btn--elevated"
        >
          📅 Gerar Escala
        </Button>
      </div>

      <div className="section-header">
        <h2>Painel de Gerenciamento</h2>
        <h3 className="section-header__subtitle">
          {selectedChurch ? selectedChurch.name : `Igreja (ID: ${id})`}
        </h3>
      </div>

      <OrganistForm
        editingId={editingId}
        newOrganistName={newOrganistName}
        isSubmitting={isSubmitting}
        error={error}
        successMessage={successMessage}
        visibleDays={visibleDays}
        availability={availability}
        onNameChange={setNewOrganistName}
        onCheckboxChange={handleCheckboxChange}
        onSubmit={handleSaveOrganist}
        onCancelEdit={handleCancelEdit}
      />
      <OrganistList
        loading={loading}
        organists={organists}
        formatOrganistAvailability={formatOrganistAvailability}
        onStartEdit={handleStartEdit}
        onRequestDeleteOrganist={handleRequestDeleteOrganist}
      />
      <ConfirmDialog
        isOpen={Boolean(pendingDeleteOrganist)}
        title="Excluir organista"
        message={
          pendingDeleteOrganist
            ? `Tem certeza que deseja excluir a organista ${pendingDeleteOrganist.name}?`
            : ''
        }
        confirmText="Excluir"
        cancelText="Cancelar"
        isDanger
        onConfirm={handleConfirmDeleteOrganist}
        onCancel={() => setPendingDeleteOrganist(null)}
      />
    </div>
  );
};

ChurchDashboard.propTypes = {
  user: PropTypes.shape({
    uid: PropTypes.string.isRequired,
    email: PropTypes.string,
  }).isRequired,
};

export default ChurchDashboard;
