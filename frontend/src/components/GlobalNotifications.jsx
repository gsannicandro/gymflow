import React, { useEffect, useState } from 'react';
import { Snackbar } from '@mui/material';
import { useSocket } from '../contexts/SocketContext';
import BrutalAlert from './ui/BrutalAlert';

const GlobalNotifications = () => {
  const { socket } = useSocket();
  const [open, setOpen] = useState(false);
  const [notification, setNotification] = useState({ message: '', severity: 'info' });

  useEffect(() => {
    if (!socket) return;

    const handleMachineFreed = (data) => {
      setNotification({
        message: `L'attrezzo è ora libero: ${data.data?.machineName || ''}`,
        severity: 'success'
      });
      setOpen(true);
    };

    const handleMachineStatusUpdate = (data) => {

    };

    socket.on('machine_freed_alert', handleMachineFreed);
    socket.on('machine_status_update', handleMachineStatusUpdate);

    return () => {
      socket.off('machine_freed_alert', handleMachineFreed);
      socket.off('machine_status_update', handleMachineStatusUpdate);
    };
  }, [socket]);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setOpen(false);
  };

  return (
    <Snackbar 
      open={open} 
      autoHideDuration={6000} 
      onClose={handleClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    >
      <BrutalAlert onClose={handleClose} severity={notification.severity} sx={{ width: '100%', mb: 0 }}>
        {notification.message}
      </BrutalAlert>
    </Snackbar>
  );
};

export default GlobalNotifications;
