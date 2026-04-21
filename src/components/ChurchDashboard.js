import React from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { useChurch } from '../contexts/ChurchContext';
import ConfirmDialog from './ui/ConfirmDialog';
import Button from './ui/Button';
import OrganistForm from './OrganistForm';
import OrganistList from './OrganistList';
import { useChurchDashboard } from '../hooks/useChurchDashboard';
import { formatRehearsalSummary } from '../constants/rehearsal';
import './ChurchDashboard.css';

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
    fieldErrors,
    successMessage,
    pendingDeleteOrganist,
    setNewOrganistName,
    setPendingDeleteOrganist,
    handleOrganistNameChange,
    handleOrganistNameBlur,
    handleCheckboxChange,
    handleStartEdit,
    handleCancelEdit,
    handleSaveOrganist,
    handleRequestDeleteOrganist,
    handleConfirmDeleteOrganist,
    formatOrganistAvailability,
  } = useChurchDashboard(user);

  if (!user) return <div className="page-loading">Carregando...</div>;

  const rehearsalSummary = selectedChurch ? formatRehearsalSummary(selectedChurch.rehearsal) : '';

  return (
    <div className="page-container page-container--lg">
      <div className="dashboard-toolbar">
        <Button onClick={() => navigate('/')} variant="secondary" size="sm">
          &larr; Voltar para Igrejas
        </Button>
        <Button
          onClick={() => navigate(`/igreja/${id}/escala`)}
          variant="primary"
          size="sm"
          className="btn--elevated"
        >
          📅 Gerar Escala
        </Button>
      </div>

      <div className="section-header">
        <h2>Gerenciamento de Organistas</h2>
        <h3 className="section-header__subtitle">
          {selectedChurch ? selectedChurch.name : `Igreja (ID: ${id})`}
        </h3>
      </div>

      {selectedChurch && rehearsalSummary && (
        <div className="church-dashboard__rehearsal">
          <strong className="church-dashboard__rehearsal-title">Ensaio local</strong>
          <p className="church-dashboard__rehearsal-summary">{rehearsalSummary}</p>
          {selectedChurch.rehearsal?.notes && (
            <p className="church-dashboard__rehearsal-note">{selectedChurch.rehearsal.notes}</p>
          )}
        </div>
      )}

      <OrganistForm
        editingId={editingId}
        newOrganistName={newOrganistName}
        isSubmitting={isSubmitting}
        error={error}
        fieldErrors={fieldErrors}
        successMessage={successMessage}
        visibleDays={visibleDays}
        availability={availability}
        onNameChange={handleOrganistNameChange}
        onNameBlur={handleOrganistNameBlur}
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
