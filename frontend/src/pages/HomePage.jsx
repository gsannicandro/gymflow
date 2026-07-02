import React, { useState, useEffect } from 'react';
import { Box, Grid, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../contexts/AuthContext';
import { gymApi } from '../api/gymApi';

import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

import BrutalBox from '../components/ui/BrutalBox';
import BrutalTypography from '../components/ui/BrutalTypography';
import AppCard from '../components/AppCard';

const HomePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeWorkout, setActiveWorkout] = useState(null);
  const [loadingWorkout, setLoadingWorkout] = useState(true);

  useEffect(() => {
    const fetchActiveWorkout = () => {
      gymApi.getWorkouts('active')
        .then(response => {
          if (response.data.data && response.data.data.length > 0) {
            setActiveWorkout(response.data.data[0]);
          }
        })
        .catch(err => {
          console.error("Error retrieving active workout", err);
        })
        .finally(() => {
          setLoadingWorkout(false);
        });
    };
    fetchActiveWorkout();
  }, []);

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: '1200px', mx: 'auto', display: 'flex', flexDirection: 'column', height: 'calc(100vh - 150px)', overflow: 'hidden' }}>
      <Box sx={{ mb: 2 }}>
        <BrutalTypography variant="title" sx={{ fontSize: { xs: '2rem', md: '3rem' } }}>
          Bentornato, {user?.firstName || 'Atleta'}!
        </BrutalTypography>
      </Box>

      <Grid container spacing={2} alignItems="stretch" sx={{ flexGrow: 1, minHeight: 0 }}>
        <Grid item xs={12} md={6} sx={{ display: 'flex' }}>
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <AppCard
              onClick={() => navigate('/workouts')}
              color="#a3e635"
              body={{
                icon: <DirectionsRunIcon sx={{ fontSize: 48 }} />,
                title: "Workout",
                subtitle: "Genera e gestisci i tuoi programmi di allenamento",
                content: (
                  <Box sx={{ mt: 2 }}>
                    {loadingWorkout ? (
                      <CircularProgress size={24} sx={{ color: 'black' }} />
                    ) : activeWorkout ? (
                      <BrutalBox color="white" sx={{ p: 2 }}>
                        <BrutalTypography sx={{ fontWeight: 900, textTransform: 'uppercase' }}>
                          In Corso
                        </BrutalTypography>
                        <BrutalTypography sx={{ fontWeight: 'bold', color: '#666', fontSize: '0.9rem' }}>
                          {activeWorkout.exercises.filter(e => e.completed).length} su {activeWorkout.exercises.length} esercizi completati
                        </BrutalTypography>
                      </BrutalBox>
                    ) : (
                      <BrutalBox color="white" sx={{ p: 2 }}>
                        <BrutalTypography sx={{ fontWeight: 900, textTransform: 'uppercase' }}>
                          Nessun allenamento
                        </BrutalTypography>
                        <BrutalTypography sx={{ fontWeight: 'bold', color: '#666', fontSize: '0.9rem', textTransform: 'none' }}>
                          Clicca per crearne uno!
                        </BrutalTypography>
                      </BrutalBox>
                    )}
                  </Box>
                )
              }}
            />
          </Box>
        </Grid>

        <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box sx={{ flex: 1, minHeight: 0 }}>
            <AppCard
              onClick={() => navigate('/machines')}
              color="white"
              body={{
                icon: <FitnessCenterIcon sx={{ fontSize: 40 }} />,
                title: "Sala Pesi",
                subtitle: "Visualizza lo stato delle macchine"
              }}
            />
          </Box>
          <Box sx={{ flex: 1, minHeight: 0 }}>
            <AppCard
              onClick={() => navigate('/courses')}
              color="white"
              body={{
                icon: <CalendarTodayIcon sx={{ fontSize: 40 }} />,
                title: "Corsi",
                subtitle: "Scopri e iscriviti ai corsi disponibili"
              }}
            />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default HomePage;
