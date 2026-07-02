import React, { useState, useEffect } from 'react';
import { Box, CircularProgress } from '@mui/material';

import { gymApi } from '../api/gymApi';
import { useAuth } from '../contexts/AuthContext';
import { useSocket } from '../contexts/SocketContext';

import BrutalAlert from '../components/ui/BrutalAlert';
import BrutalInput from '../components/ui/BrutalInput';
import BrutalTypography from '../components/ui/BrutalTypography';
import MachineCard from '../components/MachineCard';

const MachinesPage = () => {
  const { user } = useAuth();
  const { socket } = useSocket();
  const [machines, setMachines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchMachines = (isInitial = false) => {
    if (isInitial) setLoading(true);
    gymApi.getMachines()
      .then(response => {
        setMachines(response.data.data);
      })
      .catch(err => {
        console.error(err);
        setError('Errore nel caricamento delle macchine');
      })
      .finally(() => {
        if (isInitial) setLoading(false);
      });
  };

  const runMachineAction = (actionMethod, errorMsg, machineId) => {
    setActionLoading(machineId);
    actionMethod(machineId)
      .then(() => fetchMachines())
      .catch(err => setError(err.response?.data?.message || errorMsg))
      .finally(() => setActionLoading(null));
  };

  const handleUseMachine = (machineId) => runMachineAction(gymApi.useMachine, 'Errore nell\'utilizzo della macchina', machineId);
  const handleReleaseMachine = (machineId) => runMachineAction(gymApi.releaseMachine, 'Errore nel rilascio della macchina', machineId);
  const handleJoinQueue = (machineId) => runMachineAction(gymApi.joinQueue, 'Errore nell\'ingresso in coda', machineId);
  const handleLeaveQueue = (machineId) => runMachineAction(gymApi.leaveQueue, 'Errore nell\'uscita dalla coda', machineId);

  const isUsingMachine = (machine) => {
    return machine.activeUser?._id === user.id || machine.activeUser === user.id;
  };

  useEffect(() => {
    fetchMachines(true);
  }, []);

  useEffect(() => {
    if (!socket) return;
    
    const handleMachineUpdated = () => {
      fetchMachines(false);
    };

    socket.on('machine_status_update', handleMachineUpdated);

    return () => {
      socket.off('machine_status_update', handleMachineUpdated);
    };
  }, [socket]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress sx={{ color: 'black' }} />
      </Box>
    );
  }

  // Controllo utilizzo
  const isUserBusy = machines.some(m => isUsingMachine(m));

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: '1200px', mx: 'auto' }}>
      <BrutalTypography variant="title">
        Macchine
      </BrutalTypography>

      {error && (
        <BrutalAlert onClose={() => setError('')}>
          {error}
        </BrutalAlert>
      )}

      <BrutalInput
        fullWidth
        placeholder="CERCA UNA MACCHINA..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        sx={{
          mb: 4,
          boxShadow: '4px 4px 0px 0px black',
          fontFamily: '"Archivo Black", sans-serif',
          fontSize: '1.2rem',
          backgroundColor: 'white'
        }}
      />

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 3 }}>
        {machines
          .filter(m => m.name.toLowerCase().includes(searchQuery.toLowerCase()))
          .map((machine) => (
            <MachineCard
              key={machine._id}
              machine={machine}
              userId={user?.id}
              isUserBusy={isUserBusy}
              actionLoading={actionLoading}
              onUse={handleUseMachine}
              onRelease={handleReleaseMachine}
              onJoinQueue={handleJoinQueue}
              onLeaveQueue={handleLeaveQueue}
            />
          ))}
      </Box>
    </Box>
  );
};

export default MachinesPage;
