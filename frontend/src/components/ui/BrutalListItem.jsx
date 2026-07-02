import React from 'react';
import { ListItem, ListItemButton } from '@mui/material';

export const BrutalListItem = ({ children, sx = {}, active = false, disablePadding = true, ...props }) => {
  return (
    <ListItem
      disablePadding={disablePadding}
      sx={{
        mb: 1.5,
        border: '3px solid black',
        backgroundColor: active ? '#d9f99d' : 'white',
        boxShadow: '4px 4px 0px 0px black',
        ...sx
      }}
      {...props}
    >
      {children}
    </ListItem>
  );
};

export const BrutalListItemButton = ({ children, sx = {}, ...props }) => {
  return (
    <ListItemButton
      sx={{
        p: 2,
        '&.Mui-disabled': { opacity: 1 },
        ...sx
      }}
      {...props}
    >
      {children}
    </ListItemButton>
  );
};

export default BrutalListItem;
