import React, { useState } from 'react';
import { TextField } from '@mui/material';

const BrutalInput = ({ sx = {}, className = '', type, helperText, ...props }) => {
  const [capsLockActive, setCapsLockActive] = useState(false);

  const handleKeyEvent = (e) => {
    if (type === 'password' && e.getModifierState) {
      setCapsLockActive(e.getModifierState('CapsLock'));
    }
  };

  return (
    <TextField
      type={type}
      variant="outlined"
      className={`brutal-input ${className}`}
      onKeyDown={(e) => {
        handleKeyEvent(e);
        if (props.onKeyDown) props.onKeyDown(e);
      }}
      onKeyUp={(e) => {
        handleKeyEvent(e);
        if (props.onKeyUp) props.onKeyUp(e);
      }}
      sx={{
        '& .MuiOutlinedInput-root': {
          border: '4px solid black',
          borderRadius: 0,
          '& fieldset': { border: 'none' },
          '&.Mui-focused fieldset': { border: 'none' },
          '&.Mui-focused': { backgroundColor: '#d9f99d', outline: 'none' },
          '& input': {
            fontWeight: 'bold',
            fontSize: '1.25rem',
            textTransform: type === 'password' ? 'none' : 'uppercase',
            padding: 2
          }
        },
        '& .MuiInputLabel-root': {
          color: 'black',
          fontWeight: 900,
          textTransform: 'uppercase',
          backgroundColor: 'white',
          px: 1,
          ml: -0.5,
          '&.Mui-focused': {
            color: 'black',
            backgroundColor: '#d9f99d'
          }
        },
        ...sx
      }}
      helperText={capsLockActive ? "Bloc Maiusc attivo" : helperText}
      FormHelperTextProps={{
        sx: {
          fontWeight: capsLockActive ? 'bold' : 'normal',
          color: capsLockActive ? '#d32f2f' : 'inherit',
          textTransform: 'uppercase'
        }
      }}
      {...props}
    />
  );
};

export default BrutalInput;
