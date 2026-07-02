import React, { useState } from 'react';
import { Box } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { gymApi } from '../api/gymApi';

import BrutalDialog, { BrutalDialogTitle, BrutalDialogContent } from './ui/BrutalDialog';
import BrutalInput from './ui/BrutalInput';
import BrutalButton from './ui/BrutalButton';
import BrutalTypography from './ui/BrutalTypography';

const WEEKDAYS = ['Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato', 'Domenica'];

const CreateCourseDialog = ({ open, onClose, onSuccess, userId, onError }) => {
  const [submitting, setSubmitting] = useState(false);
  const [newCourse, setNewCourse] = useState({
    name: '',
    description: '',
    days: [],
    time: '',
    duration: 60,
    maxParticipants: 20
  });

  const handleToggleDay = (day) => {
    setNewCourse(prev => ({
      ...prev,
      days: prev.days.includes(day)
        ? prev.days.filter(d => d !== day)
        : [...prev.days, day]
    }));
  };

  const handleCreateCourse = (e) => {
    e.preventDefault();
    setSubmitting(true);
    gymApi.createCourse({
      ...newCourse,
      instructor: userId
    })
      .then(() => {
        setNewCourse({
          name: '',
          description: '',
          days: [],
          time: '',
          duration: 60,
          maxParticipants: 20
        });
        onSuccess();
        onClose();
      })
      .catch(err => {
        const errorMsg = err.response?.data?.message || 'Errore durante la creazione del corso';
        onError(errorMsg);
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  return (
    <BrutalDialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <BrutalDialogTitle onClose={onClose}>
        Crea Nuovo Corso
      </BrutalDialogTitle>
      <BrutalDialogContent>
        <Box 
          component="form" 
          onSubmit={handleCreateCourse} 
          sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 2 }}
        >
          <BrutalInput
            required
            fullWidth
            placeholder="NOME CORSO"
            value={newCourse.name}
            onChange={(e) => setNewCourse({ ...newCourse, name: e.target.value })}
          />
          <BrutalInput
            fullWidth
            placeholder="DESCRIZIONE"
            multiline
            rows={3}
            value={newCourse.description}
            onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
          />
          <Box>
            <BrutalTypography sx={{ mb: 1 }}>Giorni della settimana</BrutalTypography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {WEEKDAYS.map(day => (
                <BrutalButton
                  key={day}
                  type="button"
                  onClick={() => handleToggleDay(day)}
                  variant={newCourse.days.includes(day) ? 'primary' : 'secondary'}
                  sx={{
                    py: 1,
                    px: 2,
                    fontSize: '1rem'
                  }}
                >
                  {day}
                </BrutalButton>
              ))}
            </Box>
          </Box>
          <Box>
            <BrutalTypography sx={{ mb: 1 }}>Ora del Corso</BrutalTypography>
            <BrutalInput
              required
              fullWidth
              type="time"
              value={newCourse.time}
              onChange={(e) => setNewCourse({ ...newCourse, time: e.target.value })}
            />
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Box sx={{ flex: 1 }}>
              <BrutalTypography sx={{ mb: 1 }}>Durata (Minuti)</BrutalTypography>
              <BrutalInput
                required
                fullWidth
                type="number"
                inputProps={{ min: 1 }}
                value={newCourse.duration}
                onChange={(e) => setNewCourse({ ...newCourse, duration: e.target.value })}
              />
            </Box>
            <Box sx={{ flex: 1 }}>
              <BrutalTypography sx={{ mb: 1 }}>Posti Massimi</BrutalTypography>
              <BrutalInput
                required
                fullWidth
                type="number"
                inputProps={{ min: 1 }}
                value={newCourse.maxParticipants}
                onChange={(e) => setNewCourse({ ...newCourse, maxParticipants: e.target.value })}
              />
            </Box>
          </Box>
          <BrutalButton
            type="submit"
            disabled={submitting}
            variant="primary"
            sx={{
              py: 2,
              mt: 2,
              fontSize: '1rem'
            }}
          >
            <AddIcon sx={{ mr: 1 }} />
            {submitting ? 'Creazione...' : 'Conferma e Crea'}
          </BrutalButton>
        </Box>
      </BrutalDialogContent>
    </BrutalDialog>
  );
};

export default CreateCourseDialog;
