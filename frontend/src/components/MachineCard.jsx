import React from 'react';
import { Box } from '@mui/material';

import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';

import UserAvatar from './UserAvatar';
import BrutalButton from './ui/BrutalButton';
import BrutalTypography from './ui/BrutalTypography';
import AppCard from './AppCard';

const MachineCard = ({
  machine,
  userId,
  isUserBusy,
  actionLoading,
  onUse,
  onRelease,
  onJoinQueue,
  onLeaveQueue
}) => {
  const isAvailable = machine.status === 'available';
  const usingThis = machine.activeUser?._id === userId || machine.activeUser === userId;
  const inQueue = machine.queue?.some(q => q._id === userId || q === userId);
  const isLoadingThis = actionLoading === machine._id;

  let footerActions = [];
  if (isAvailable && !usingThis) {
    footerActions.push(
      <BrutalButton 
        key="use" 
        fullWidth 
        onClick={() => onUse(machine._id)} 
        disabled={actionLoading !== null || isUserBusy} 
        variant="primary" 
        sx={{ py: 1.5, fontSize: '1rem' }}
      >
        <PlayArrowIcon sx={{ mr: 1 }} />
        {isLoadingThis ? 'Attendere...' : (isUserBusy ? 'Già occupato' : 'Inizia')}
      </BrutalButton>
    );
  } else if (usingThis) {
    footerActions.push(
      <BrutalButton 
        key="release" 
        fullWidth 
        onClick={() => onRelease(machine._id)} 
        disabled={actionLoading !== null} 
        variant="danger" 
        sx={{ py: 1.5, fontSize: '1rem' }}
      >
        <StopIcon sx={{ mr: 1 }} />
        {isLoadingThis ? 'Attendere...' : 'Rilascia'}
      </BrutalButton>
    );
  } else if (inQueue) {
    footerActions.push(
      <BrutalButton 
        key="leaveQueue" 
        fullWidth 
        onClick={() => onLeaveQueue(machine._id)} 
        disabled={actionLoading !== null} 
        variant="secondary" 
        sx={{ py: 1.5, fontSize: '1rem' }}
      >
        <PersonRemoveIcon sx={{ mr: 1 }} />
        {isLoadingThis ? 'Attendere...' : 'Lascia Coda'}
      </BrutalButton>
    );
  } else {
    footerActions.push(
      <BrutalButton 
        key="joinQueue" 
        fullWidth 
        onClick={() => onJoinQueue(machine._id)} 
        disabled={actionLoading !== null} 
        variant="secondary" 
        sx={{ py: 1.5, fontSize: '1rem' }}
      >
        <PersonAddIcon sx={{ mr: 1 }} />
        {isLoadingThis ? 'Attendere...' : 'Mettiti in Coda'}
      </BrutalButton>
    );
  }

  return (
    <AppCard
      header={{
        text: isAvailable ? 'DISPONIBILE' : 'OCCUPATA',
        bgColor: isAvailable ? '#a3e635' : '#ef5350',
        align: 'center'
      }}
      body={{
        icon: <FitnessCenterIcon sx={{ fontSize: 36 }} />,
        title: machine.name,
        subtitle: machine.type,
        details: [
          machine.activeUser ? {
            icon: <UserAvatar user={machine.activeUser} size={32} borderWeight={2} />,
            text: `In uso da: ${machine.activeUser.firstName} ${machine.activeUser.lastName || ''}`.trim()
          } : {
            icon: (
              <Box 
                sx={{ 
                  width: 32, 
                  height: 32, 
                  borderRadius: '50%', 
                  backgroundColor: '#eee', 
                  border: '2px dashed #999' 
                }} 
              />
            ),
            text: <BrutalTypography sx={{ fontSize: '1.1rem', color: '#999' }}>Nessun utente</BrutalTypography>
          },
          {
            icon: (
              <Box 
                sx={{ 
                  width: 32, 
                  height: 32, 
                  display: 'flex', 
                  justifyContent: 'center', 
                  alignItems: 'center' 
                }}
              >
                <BrutalTypography sx={{ fontSize: '1.5rem', textTransform: 'none' }}>⏱</BrutalTypography>
              </Box>
            ),
            text: (
              <BrutalTypography sx={{ fontSize: '1.1rem', color: machine.queue?.length > 0 ? 'black' : '#999' }}>
                Coda: {machine.queue?.length || 0} in attesa
              </BrutalTypography>
            )
          }
        ]
      }}
      footer={{ actions: footerActions }}
    />
  );
};

export default MachineCard;
