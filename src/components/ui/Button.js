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

const BUTTON_SIZES = {
  sm: { padding: '8px 12px', fontSize: '14px' },
  md: { padding: '10px 20px', fontSize: '16px' },
  lg: { padding: '12px 24px', fontSize: '16px' },
};

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md',
  fullWidth = false,
  disabled = false,
  type = 'button',
  onClick,
  style = {},
  ...props 
}) => {
  const baseStyle = {
    ...BUTTON_SIZES[size],
    border: 'none',
    borderRadius: '4px',
    cursor: disabled ? 'not-allowed' : 'pointer',
    fontWeight: 'bold',
    width: fullWidth ? '100%' : undefined,
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
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  fullWidth: PropTypes.bool,
  disabled: PropTypes.bool,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  onClick: PropTypes.func,
  style: PropTypes.object,
};

export default Button;
