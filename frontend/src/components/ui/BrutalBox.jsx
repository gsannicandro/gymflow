import React from 'react';
import { Box } from '@mui/material';

const BrutalBox = ({ children, sx = {}, className = '', color = 'white', ...props }) => {
  return (
    <Box
      className={`brutal-border ${className}`}
      sx={{
        backgroundColor: color,
        ...sx
      }}
      {...props}
    >
      {children}
    </Box>
  );
};

export default BrutalBox;
