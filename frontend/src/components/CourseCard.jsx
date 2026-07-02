import React from 'react';
import { CircularProgress } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ChatIcon from '@mui/icons-material/Chat';
import AddIcon from '@mui/icons-material/Add';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PeopleIcon from '@mui/icons-material/People';
import PersonIcon from '@mui/icons-material/Person';
import EventIcon from '@mui/icons-material/Event';

import BrutalButton from './ui/BrutalButton';
import AppCard from './AppCard';

const CourseCard = ({
  course,
  enrolled,
  userRole,
  actionLoading,
  onEnroll,
  onUnenroll,
  onDelete,
  onOpenChat
}) => {
  const isFull = course.participants?.length >= course.maxParticipants;
  const isTrainerOrOwner = ['trainer', 'owner'].includes(userRole);
  const isLoadingThis = actionLoading === course._id;

  return (
    <AppCard
      header={{
        text: enrolled ? '✓ Iscritto' : (isFull ? 'Posti Esauriti' : 'Disponibile'),
        bgColor: enrolled ? '#a3e635' : (isFull ? '#fca5a5' : '#f3f4f6'),
        action: isTrainerOrOwner ? (
          <BrutalButton 
            onClick={() => onDelete(course._id)} 
            disabled={actionLoading !== null} 
            variant="danger" 
            sx={{ p: 1, minWidth: 'auto', lineHeight: 0, fontSize: '1rem' }}
          >
            {isLoadingThis ? <CircularProgress size={20} sx={{ color: 'black' }} /> : <DeleteIcon />}
          </BrutalButton>
        ) : null
      }}
      body={{
        title: course.name,
        subtitle: course.description || 'Nessuna descrizione',
        details: [
          { 
            icon: <PersonIcon />, 
            text: course.instructor ? `${course.instructor.firstName} ${course.instructor.lastName || ''}`.trim() : 'N/A' 
          },
          { 
            icon: <EventIcon />, 
            text: course.days?.join(', ') || 'N/A' 
          },
          { 
            icon: <AccessTimeIcon />, 
            text: `${course.time || 'N/A'} (${course.duration} min)` 
          },
          { 
            icon: <PeopleIcon />, 
            text: `${course.participants?.length || 0}/${course.maxParticipants} Posti` 
          }
        ]
      }}
      footer={{
        actions: enrolled ? [
          <BrutalButton 
            key="leave" 
            onClick={() => onUnenroll(course._id)} 
            disabled={actionLoading !== null} 
            variant="danger" 
            sx={{ py: 1.5, fontSize: '0.8rem' }}
          >
            <DeleteIcon sx={{ mr: 1 }} />{isLoadingThis ? '...' : 'Abbandona'}
          </BrutalButton>,
          <BrutalButton 
            key="chat" 
            onClick={() => onOpenChat(course._id, course.name)} 
            variant="primary" 
            sx={{ py: 1.5, fontSize: '0.8rem' }}
          >
            <ChatIcon sx={{ mr: 1 }} />Live Chat
          </BrutalButton>
        ] : [
          <BrutalButton 
            key="enroll" 
            onClick={() => onEnroll(course._id)} 
            disabled={actionLoading !== null || isFull} 
            variant="primary" 
            sx={{ py: 1.5, fontSize: '1rem' }}
          >
            <AddIcon sx={{ mr: 1 }} />{isLoadingThis ? 'Attendi...' : (isFull ? 'Al Completo' : 'Iscriviti Ora')}
          </BrutalButton>
        ]
      }}
    />
  );
};

export default CourseCard;
