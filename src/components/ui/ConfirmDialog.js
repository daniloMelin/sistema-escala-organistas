import React from 'react';
import PropTypes from 'prop-types';
import Button from './Button';
import './ConfirmDialog.css';

const ConfirmDialog = ({
  isOpen,
  title = 'Confirmar ação',
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  onConfirm,
  onCancel,
  isDanger = false,
}) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="confirm-dialog__backdrop"
      onClick={onCancel}
    >
      <div
        className="confirm-dialog__card"
        onClick={(e) => e.stopPropagation()}
      >
        <h4 className="confirm-dialog__title">{title}</h4>
        <p className="confirm-dialog__message">
          {message}
        </p>

        <div className="confirm-dialog__actions">
          <Button
            type="button"
            onClick={onCancel}
            variant="secondary"
            size="sm"
          >
            {cancelText}
          </Button>
          <Button
            type="button"
            onClick={onConfirm}
            variant={isDanger ? 'danger' : 'primary'}
            size="sm"
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
};

ConfirmDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  title: PropTypes.string,
  message: PropTypes.string,
  confirmText: PropTypes.string,
  cancelText: PropTypes.string,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  isDanger: PropTypes.bool,
};

export default ConfirmDialog;
