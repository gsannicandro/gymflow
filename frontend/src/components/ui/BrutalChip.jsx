import React from 'react';
import { Chip } from '@mui/material';

const BrutalChip = ({ sx = {}, color = 'white', label, ...props }) => {
  return (
    <Chip
      label={label}
      sx={{
        border: '3px solid black',
        borderRadius: 0,
        backgroundColor: color,
        fontWeight: 900,
        textTransform: 'uppercase',
        fontFamily: '"Archivo Black", sans-serif',
        ...sx
      }}
      {...props}
    />
  );
};

export default BrutalChip;
