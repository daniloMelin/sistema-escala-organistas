import React from 'react';
import PropTypes from 'prop-types';

const Input = ({ 
  label, 
  error, 
  required = false,
  style = {},
  ...props 
}) => {
  return (
    <div style={{ marginBottom: '15px' }}>
      {label && (
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'normal' }}>
          {label}
          {required && <span style={{ color: 'red' }}> *</span>}
        </label>
      )}
      <input
        style={{
          width: '100%',
          padding: '8px',
          boxSizing: 'border-box',
          borderRadius: '4px',
          border: error ? '1px solid red' : '1px solid #ccc',
          fontSize: '16px',
          ...style
        }}
        {...props}
      />
      {error && (
        <p style={{ color: 'red', fontSize: '0.9em', marginTop: '5px', marginBottom: 0 }}>
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
  style: PropTypes.object,
};

export default Input;
