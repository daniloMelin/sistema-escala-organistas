import React, { useId } from 'react';
import PropTypes from 'prop-types';
import './Input.css';

const Input = ({ 
  label, 
  error, 
  required = false,
  size = 'md',
  id,
  ...props 
}) => {
  const generatedId = useId();
  const inputId = id || `input-${generatedId}`;

  return (
    <div className="input-field">
      {label && (
        <label htmlFor={inputId} className="input-field__label">
          {label}
          {required && <span className="input-field__required"> *</span>}
        </label>
      )}
      <input
        id={inputId}
        className={[
          'input-field__control',
          size === 'sm' ? 'input-field__control--sm' : '',
          error ? 'input-field__control--error' : '',
        ].join(' ').trim()}
        {...props}
      />
      {error && (
        <p className="input-field__error">
          {error}
        </p>
      )}
    </div>
  );
};

Input.propTypes = {
  label: PropTypes.string,
  error: PropTypes.string,
  required: PropTypes.bool,
  size: PropTypes.oneOf(['sm', 'md']),
  id: PropTypes.string,
};

export default Input;
