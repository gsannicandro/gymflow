import React from 'react';
import { Typography } from '@mui/material';

const BrutalTypography = ({ variant = 'body1', sx = {}, children, ...props }) => {
  const baseSx = {
    fontFamily: '"Archivo Black", sans-serif',
    textTransform: 'uppercase',
  };

  const variantSx = {
    title: {
      fontSize: { xs: '2.5rem', md: '4rem' },
      fontStyle: 'italic',
      letterSpacing: '-0.05em',
      lineHeight: 1,
    },
    subtitle: {
      fontSize: { xs: '2rem', md: '3rem' },
      fontStyle: 'italic',
      letterSpacing: '-0.05em',
    },
    heading: {
      fontSize: '1.5rem',
    },
    body1: {
      fontSize: '1rem',
      fontWeight: 900,
    }
  };

  return (
    <Typography
      sx={{
        ...baseSx,
        ...(variantSx[variant] || {}),
        ...sx
      }}
      {...props}
    >
      {children}
    </Typography>
  );
};

export default BrutalTypography;
