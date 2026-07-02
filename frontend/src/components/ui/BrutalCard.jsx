import React from 'react';
import { Box } from '@mui/material';

const BrutalCard = ({ children, sx = {}, className = '', color = 'white', onClick, ...props }) => {
  return (
    <Box
      className={`brutal-border brutal-shadow ${onClick ? 'brutal-btn' : ''} ${className}`}
      onClick={onClick}
      sx={{
        backgroundColor: color,
        p: 4,
        display: 'flex',
        flexDirection: 'column',
        ...(onClick ? { cursor: 'pointer' } : {}),
        ...sx
      }}
      {...props}
    >
      {children}
    </Box>
  );
};

export default BrutalCard;
