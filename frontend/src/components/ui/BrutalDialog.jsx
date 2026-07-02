import React from 'react';
import { Dialog, DialogTitle, DialogContent, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

export const BrutalDialog = ({ children, paperSx = {}, ...props }) => {
  return (
    <Dialog
      PaperProps={{
        sx: {
          border: '4px solid black',
          borderRadius: 0,
          boxShadow: '8px 8px 0px 0px black',
          ...paperSx
        }
      }}
      {...props}
    >
      {children}
    </Dialog>
  );
};

export const BrutalDialogTitle = ({ children, onClose, sx = {}, ...props }) => {
  return (
    <DialogTitle
      sx={{
        fontFamily: '"Archivo Black", sans-serif',
        textTransform: 'uppercase',
        borderBottom: '4px solid black',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        p: 2,
        backgroundColor: '#a3e635',
        ...sx
      }}
      {...props}
    >
      {children}
      {onClose && (
        <IconButton onClick={onClose} sx={{ color: 'black' }}>
          <CloseIcon />
        </IconButton>
      )}
    </DialogTitle>
  );
};

export const BrutalDialogContent = ({ children, sx = {}, ...props }) => {
  return (
    <DialogContent
      sx={{
        p: 4,
        '&::-webkit-scrollbar': { display: 'none' },
        scrollbarWidth: 'none',
        ...sx
      }}
      {...props}
    >
      {children}
    </DialogContent>
  );
};

export default BrutalDialog;
