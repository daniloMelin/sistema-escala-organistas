import React from 'react';
import PropTypes from 'prop-types';

const BUTTON_STYLES = {
  primary: { backgroundColor: '#007bff', color: 'white' },
  secondary: { backgroundColor: '#6c757d', color: 'white' },
  success: { backgroundColor: '#28a745', color: 'white' },
  danger: { backgroundColor: '#dc3545', color: 'white' },
  warning: { backgroundColor: '#ffc107', color: '#333' },
  info: { backgroundColor: '#17a2b8', color: 'white' },
};

const Button = ({ 
  children, 
  variant = 'primary', 
  disabled = false,
  type = 'button',
  onClick,
  style = {},
  ...props 
}) => {
  const baseStyle = {
    padding: '10px 20px',
    border: 'none',
    borderRadius: '4px',
    cursor: disabled ? 'not-allowed' : 'pointer',
    fontWeight: 'bold',
    fontSize: '16px',
    opacity: disabled ? 0.6 : 1,
    transition: 'opacity 0.2s',
    ...BUTTON_STYLES[variant] || BUTTON_STYLES.primary,
    ...style
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={baseStyle}
      {...props}
    >
      {children}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['primary', 'secondary', 'success', 'danger', 'warning', 'info']),
  disabled: PropTypes.bool,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  onClick: PropTypes.func,
  style: PropTypes.object,
};

export default Button;
