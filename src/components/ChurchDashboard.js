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

  if (!user) return <div style={{ padding: 20 }}>Carregando...</div>;

  return (
    <div style={{ padding: '20px', maxWidth: '900px', margin: 'auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <Button onClick={() => navigate('/')} variant="secondary" style={{ padding: '8px 12px', fontSize: '14px' }}>
          &larr; Voltar para Igrejas
        </Button>
        <Button
          onClick={() => navigate(`/igreja/${id}/escala`)}
          variant="primary"
          style={{ boxShadow: '0 2px 5px rgba(0,0,0,0.2)' }}
        >
          📅 Gerar Escala
        </Button>
      </div>

      <div style={{ borderBottom: '2px solid #eee', paddingBottom: '10px', marginBottom: '20px' }}>
        <h2>Painel de Gerenciamento</h2>
        <h3 style={{ color: '#0056b3', margin: '5px 0' }}>
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
