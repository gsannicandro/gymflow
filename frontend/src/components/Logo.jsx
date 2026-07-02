import React from 'react';
import { Typography } from '@mui/material';

const Logo = ({ size = { xs: '1.5rem', md: '2rem' }, stacked = false, accentSx = { color: '#a3e635' }, sx = {}, ...props }) => {
  return (
    <Typography
      sx={{
        fontFamily: '"Archivo Black", sans-serif',
        fontSize: size,
        fontStyle: 'italic',
        letterSpacing: '-0.05em',
        textTransform: 'uppercase',
        lineHeight: 1,
        ...sx
      }}
      {...props}
    >
      GYM{stacked ? <br /> : ''}<span style={{ ...accentSx }}>FLOW</span>
    </Typography>
  );
};

export default Logo;
