import React, { forwardRef } from 'react';
import { Alert } from '@mui/material';

// Componente Alert personalizzato in stile Neo-brutalista.
// forwardRef consente a componenti contenitori di accedere al riferimento del DOM interno dell'Alert.
const BrutalAlert = forwardRef(({ children, severity = "error", sx = {}, ...props }, ref) => {
  return (
    <Alert
      ref={ref}
      severity={severity}
      sx={{
        mb: 3,
        border: '4px solid black',
        borderRadius: 0,
        boxShadow: '5px 5px 0px 0px black',
        fontWeight: 'bold',
        textTransform: 'uppercase',
        ...sx
      }}
      {...props}
    >
      {children}
    </Alert>
  );
});

export default BrutalAlert;
