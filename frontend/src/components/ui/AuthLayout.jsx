import React from 'react';
import { Box } from '@mui/material';
import Logo from '../Logo';
import BrutalTypography from './BrutalTypography';

const AuthLayout = ({ children, title, logoSize = { xs: '4rem', md: '8rem' }, stackedLogo = true }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, minHeight: '100vh' }}>
      <Box
        className="lime-bg"
        sx={{
          width: { xs: '100%', md: '50%' },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 6,
          borderBottom: { xs: '8px solid black', md: 'none' },
          borderRight: { md: '8px solid black' },
          flex: 1
        }}
      >
        <Box sx={{ textAlign: 'center' }}>
          <Logo 
            size={logoSize} 
            stacked={stackedLogo} 
            accentSx={{ color: 'white', textShadow: '6px 6px 0px rgba(0,0,0,1)' }} 
          />
        </Box>
      </Box>

      <Box
        sx={{
          width: { xs: '100%', md: '50%' },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 4,
          backgroundColor: 'white',
          flex: 1
        }}
      >
        <Box sx={{ width: '100%', maxWidth: '500px' }}>
          <Box sx={{ mb: 6, borderLeft: '8px solid black', pl: 2 }}>
            <BrutalTypography variant="title">
              {title}
            </BrutalTypography>
          </Box>
          
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default AuthLayout;
