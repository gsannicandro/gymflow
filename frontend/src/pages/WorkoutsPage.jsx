import React, { useState, useEffect } from 'react';
import {
  Box,
  CircularProgress,
  List,
  ListItemText,
  ListItemIcon,
} from '@mui/material';
import { gymApi } from '../api/gymApi';
import AddIcon from '@mui/icons-material/Add';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import BrutalButton from '../components/ui/BrutalButton';
import BrutalBox from '../components/ui/BrutalBox';
import BrutalAlert from '../components/ui/BrutalAlert';
import BrutalTypography from '../components/ui/BrutalTypography';
import BrutalChip from '../components/ui/BrutalChip';
import BrutalAccordion, { BrutalAccordionSummary, BrutalAccordionDetails } from '../components/ui/BrutalAccordion';
import BrutalListItem, { BrutalListItemButton } from '../components/ui/BrutalListItem';
import AppCard from '../components/AppCard';

const WorkoutsPage = () => {
  const [activeWorkouts, setActiveWorkouts] = useState([]);
  const [pastWorkouts, setPastWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const fetchWorkouts = (isInitial = false) => {
    if (isInitial) setLoading(true);
    Promise.all([
      gymApi.getWorkouts('active'),
      gymApi.getWorkouts('completed')
    ])
      .then(([activeRes, pastRes]) => {
        setActiveWorkouts(activeRes.data.data || []);
        setPastWorkouts(pastRes.data.data || []);
      })
      .catch(err => {
        setError('Errore nel caricamento degli allenamenti');
      })
      .finally(() => {
        if (isInitial) setLoading(false);
      });
  };

  useEffect(() => {
    fetchWorkouts(true);
  }, []);

  const runWorkoutAction = (actionMethod, errorMsg) => {
    setActionLoading(true);
    actionMethod()
      .then(() => fetchWorkouts())
      .catch(err => setError(err.response?.data?.message || errorMsg))
      .finally(() => setActionLoading(false));
  };

  const handleGenerateWorkout = () => runWorkoutAction(() => gymApi.generateWorkout(), 'Errore nella generazione dell\'allenamento');
  const handleMarkExerciseComplete = (workoutId, exerciseId) => runWorkoutAction(() => gymApi.markExerciseComplete(workoutId, exerciseId), 'Errore nel completamento dell\'esercizio');
  const getStatusChip = (status) => {
    const bgColor = status === 'active' ? '#a3e635' : '#d9f99d';
    const label = status === 'active' ? 'IN CORSO' : 'COMPLETATO';
    return (
      <BrutalChip label={label} color={bgColor} />
    );
  };

  const renderExerciseList = (workout, isPast = false) => (
    <List>
      {workout.exercises.map((exerciseEntry) => (
        <BrutalListItem key={exerciseEntry._id} active={exerciseEntry.completed}>
          <BrutalListItemButton disabled={exerciseEntry.completed || workout.status === 'completed'} onClick={() => handleMarkExerciseComplete(workout._id, exerciseEntry.exercise._id)}>
            <ListItemIcon sx={{ minWidth: '48px', alignItems: 'flex-start', mt: 1 }}>
              {exerciseEntry.completed ? <CheckCircleIcon sx={{ color: 'black', fontSize: 32 }} /> : <RadioButtonUncheckedIcon sx={{ color: 'black', fontSize: 32 }} />}
            </ListItemIcon>
            <ListItemText
              disableTypography
              primary={<BrutalTypography sx={{ fontSize: '1.2rem', mb: 0.5 }}>{exerciseEntry.exercise.name}</BrutalTypography>}
              secondary={
                <Box sx={{ mt: 1 }}>
                  <BrutalTypography sx={{ fontSize: '0.9rem', mb: 1.5, textTransform: 'none' }}>{exerciseEntry.exercise.description}</BrutalTypography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    <BrutalChip label={`Gruppo: ${exerciseEntry.exercise.muscle_group || 'N/D'}`} sx={{ border: '2px solid black' }} size="small" />
                    <BrutalChip label={`Difficoltà: ${exerciseEntry.exercise.difficulty}`} sx={{ border: '2px solid black' }} size="small" />
                    <BrutalChip label={`${exerciseEntry.exercise.sets} Serie`} color="#a3e635" sx={{ border: '2px solid black' }} size="small" />
                    <BrutalChip label={`${exerciseEntry.exercise.reps} Reps`} color="#a3e635" sx={{ border: '2px solid black' }} size="small" />
                  </Box>
                </Box>
              }
            />
          </BrutalListItemButton>
        </BrutalListItem>
      ))}
    </List>
  );

  const renderPastWorkoutAccordion = (workout) => (
    <BrutalAccordion key={workout._id}>
      <BrutalAccordionSummary>
        <BrutalTypography sx={{ fontSize: '1.3rem', letterSpacing: '-0.025em' }}>{new Date(workout.startDate).toLocaleDateString('it-IT')}</BrutalTypography>
        <Box sx={{ mr: 2 }}>{getStatusChip(workout.status)}</Box>
      </BrutalAccordionSummary>
      <BrutalAccordionDetails>
        <BrutalTypography sx={{ mb: 2 }}>Esercizi eseguiti: {workout.exercises.length}</BrutalTypography>
        {renderExerciseList(workout, true)}
      </BrutalAccordionDetails>
    </BrutalAccordion>
  );
  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: '1200px', mx: 'auto' }}>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', mb: 5, gap: 2 }}>
        <BrutalTypography variant="title">
          Workouts
        </BrutalTypography>
        <BrutalButton
          onClick={handleGenerateWorkout}
          disabled={actionLoading || activeWorkouts.length > 0}
          variant="primary"
          sx={{ px: 3, py: 1.5, fontSize: '1rem' }}
        >
          <AddIcon sx={{ mr: 1 }} />
          {actionLoading ? 'Generando...' : 'Nuovo Allenamento'}
        </BrutalButton>
      </Box>

      {error && (
        <BrutalAlert onClose={() => setError('')}>
          {error}
        </BrutalAlert>
      )}

      <Box sx={{ mb: 6 }}>
        {activeWorkouts.length === 0 ? (
          <BrutalBox sx={{ p: 5, textAlign: 'center', backgroundColor: '#f9fafb' }}>
            <BrutalTypography sx={{ fontWeight: 900, textTransform: 'uppercase', color: '#333', fontSize: '1.2rem' }}>
              Nessun allenamento in corso
            </BrutalTypography>
            <BrutalTypography sx={{ fontWeight: 'bold', color: '#666', mt: 1 }}>
              Clicca "Nuovo Allenamento" per iniziare!
            </BrutalTypography>
          </BrutalBox>
        ) : (
          activeWorkouts.map(workout => (
            <Box key={workout._id} sx={{ mb: 4 }}>
              <AppCard
                header={{
                  content: <BrutalTypography variant="subtitle" sx={{ fontSize: '1.8rem' }}>Allenamento in corso</BrutalTypography>,
                  action: getStatusChip(workout.status),
                  p: 4
                }}
                body={{
                  content: (
                    <Box>
                      <BrutalTypography sx={{ mb: 3, fontWeight: 900, color: '#000', textTransform: 'uppercase', fontSize: '1.1rem' }}>
                        Progresso: {workout.exercises.filter(e => e.completed).length} su {workout.exercises.length} esercizi completati
                      </BrutalTypography>
                      {renderExerciseList(workout)}
                    </Box>
                  )
                }}
              />
            </Box>
          ))
        )}
      </Box>

      <Box>
        <BrutalTypography
          variant="subtitle"
          sx={{
            mb: 3,
            pb: 1,
            borderBottom: '4px solid black'
          }}
        >
          Storico
        </BrutalTypography>

        {pastWorkouts.length === 0 ? (
          <BrutalBox sx={{ p: 4, textAlign: 'center', backgroundColor: '#f5f5f5' }}>
            <BrutalTypography sx={{ color: '#666' }}>
              Nessun allenamento completato
            </BrutalTypography>
          </BrutalBox>
        ) : (
          pastWorkouts.map(workout => renderPastWorkoutAccordion(workout))
        )}
      </Box>
    </Box>
  );
};

export default WorkoutsPage;
