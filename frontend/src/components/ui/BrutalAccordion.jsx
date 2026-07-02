import React from 'react';
import { Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export const BrutalAccordion = ({ children, sx = {}, ...props }) => {
  return (
    <Accordion
      disableGutters
      elevation={0}
      sx={{
        mb: 2,
        border: '4px solid black',
        borderRadius: '0 !important',
        backgroundColor: '#f5f5f5',
        boxShadow: '5px 5px 0px 0px black',
        '&:before': { display: 'none' },
        '&.Mui-expanded': { mb: 2 },
        ...sx
      }}
      {...props}
    >
      {children}
    </Accordion>
  );
};

export const BrutalAccordionSummary = ({ children, sx = {}, ...props }) => {
  return (
    <AccordionSummary
      expandIcon={<ExpandMoreIcon sx={{ color: 'black', fontSize: 32 }} />}
      sx={{
        borderBottom: '4px solid black',
        backgroundColor: '#e5e7eb',
        '& .MuiAccordionSummary-content': {
          alignItems: 'center',
          justifyContent: 'space-between',
          my: 2
        },
        ...sx
      }}
      {...props}
    >
      {children}
    </AccordionSummary>
  );
};

export const BrutalAccordionDetails = ({ children, sx = {}, ...props }) => {
  return (
    <AccordionDetails
      sx={{
        p: 3,
        backgroundColor: 'white',
        ...sx
      }}
      {...props}
    >
      {children}
    </AccordionDetails>
  );
};

export default BrutalAccordion;
