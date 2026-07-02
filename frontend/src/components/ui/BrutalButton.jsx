import React from 'react';
import { Button } from '@mui/material';

const getVariantStyles = (variant) => {
  switch (variant) {
    case 'secondary':
      return {
        backgroundColor: 'white',
        color: 'black',
        '&:hover': { backgroundColor: '#f5f5f5' }
      };
    case 'danger':
      return {
        backgroundColor: '#ef5350',
        color: 'white',
        '&:hover': { backgroundColor: '#d32f2f' }
      };
    case 'dark':
      return {
        backgroundColor: 'black',
        color: '#a3e635',
        '&:hover': { backgroundColor: '#333' }
      };
    case 'primary':
    default:
      return {
        backgroundColor: '#a3e635',
        color: 'black',
        '&:hover': { backgroundColor: '#84cc16' }
      };
  }
};

const BrutalButton = ({ children, variant = 'primary', sx = {}, className = '', ...props }) => {
  const variantStyles = getVariantStyles(variant);
  
  return (
    <Button
      className={`brutal-btn brutal-shadow ${className}`}
      sx={{
        py: 2.5,
        border: '4px solid black',
        borderRadius: 0,
        fontWeight: 900,
        fontSize: '1.5rem',
        fontStyle: 'italic',
        textTransform: 'uppercase',
        '&:disabled': { backgroundColor: '#e0e0e0', color: '#999' },
        ...variantStyles,
        ...sx
      }}
      {...props}
    >
      {children}
    </Button>
  );
};

export default BrutalButton;
