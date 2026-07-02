import React, { useState, useEffect } from 'react';
import { Box, CircularProgress } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

import { gymApi } from '../api/gymApi';
import { useAuth } from '../contexts/AuthContext';

import BrutalButton from '../components/ui/BrutalButton';
import BrutalAlert from '../components/ui/BrutalAlert';
import BrutalBox from '../components/ui/BrutalBox';
import BrutalTypography from '../components/ui/BrutalTypography';

import CourseCard from '../components/CourseCard';
import CreateCourseDialog from '../components/CreateCourseDialog';
import CourseChatDialog from '../components/CourseChatDialog';

// Pagina corsi
const CoursesPage = () => {
  const { user } = useAuth();
  
  const [courses, setCourses] = useState([]);
  const [myCourses, setMyCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(null);
  
  const [chatCourseId, setChatCourseId] = useState(null);
  const [chatCourseName, setChatCourseName] = useState('');
  const [openCreateDialog, setOpenCreateDialog] = useState(false);

  // Apre chat
  const handleOpenChat = (courseId, courseName) => {
    setChatCourseId(courseId);
    setChatCourseName(courseName);
  };

  // Chiude chat
  const handleCloseChat = () => {
    setChatCourseId(null);
    setChatCourseName('');
  };

  // Fetch dati
  const fetchCourses = (isInitial = false) => {
    if (isInitial) setLoading(true);
    Promise.all([
      gymApi.getCourses(),
      gymApi.getMyCourses()
    ])
      .then(([coursesRes, myCoursesRes]) => {
        setCourses(coursesRes.data.data);
        setMyCourses(myCoursesRes.data.data || []);
      })
      .catch(err => {
        console.error(err);
        setError('Errore nel caricamento dei corsi');
      })
      .finally(() => {
        if (isInitial) setLoading(false);
      });
  };

  const runCourseAction = (actionMethod, errorMsg, courseId) => {
    setActionLoading(courseId);
    actionMethod(courseId)
      .then(() => fetchCourses())
      .catch(err => setError(err.response?.data?.message || errorMsg))
      .finally(() => setActionLoading(null));
  };

  const handleEnroll = (courseId) => runCourseAction(gymApi.enrollCourse, "Errore durante l'iscrizione", courseId);
  const handleUnenroll = (courseId) => runCourseAction(gymApi.unenrollCourse, "Errore durante la disiscrizione", courseId);
  const handleDeleteCourse = (courseId) => {
    if (window.confirm('Sei sicuro di voler eliminare questo corso? Tutti gli iscritti verranno rimossi.')) {
      runCourseAction(gymApi.deleteCourse, "Errore durante l'eliminazione del corso", courseId);
    }
  };

  // Verifica iscrizione
  const isEnrolled = (courseId) => {
    return myCourses.some(c => c._id === courseId) ||
      courses.find(c => c._id === courseId)?.participants?.includes(user.id);
  };

  // Init
  useEffect(() => {
    fetchCourses(true);
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress sx={{ color: 'black' }} />
      </Box>
    );
  }

  const enrolledCourses = courses.filter(c => isEnrolled(c._id));
  const availableCourses = courses.filter(c => !isEnrolled(c._id));

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: '1200px', mx: 'auto' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, pb: 1, borderBottom: '8px solid black', flexWrap: 'wrap', gap: 2 }}>
        <BrutalTypography variant="title">
          Corsi e Classi
        </BrutalTypography>
        {(['trainer', 'owner'].includes(user?.role)) && (
          <BrutalButton
            onClick={() => setOpenCreateDialog(true)}
            variant="primary"
            sx={{ py: 1.5, px: 3, fontSize: '1rem' }}
          >
            <AddIcon sx={{ mr: 1 }} />
            Crea Corso
          </BrutalButton>
        )}
      </Box>

      {error && (
        <BrutalAlert onClose={() => setError('')}>
          {error}
        </BrutalAlert>
      )}

      <Box sx={{ mb: 6 }}>
        {enrolledCourses.length === 0 ? (
          <BrutalBox sx={{ p: 4, textAlign: 'center', backgroundColor: '#f5f5f5' }}>
            <BrutalTypography sx={{ color: '#666' }}>
              Non sei iscritto a nessun corso al momento.
            </BrutalTypography>
          </BrutalBox>
        ) : (
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 3 }}>
            {enrolledCourses.map(course => (
              <CourseCard
                key={course._id}
                course={course}
                enrolled={true}
                userRole={user?.role}
                actionLoading={actionLoading}
                onEnroll={handleEnroll}
                onUnenroll={handleUnenroll}
                onDelete={handleDeleteCourse}
                onOpenChat={handleOpenChat}
              />
            ))}
          </Box>
        )}
      </Box>

      <Box sx={{ mb: 6 }}>
        <BrutalTypography variant="subtitle" sx={{ mb: 3, pb: 1, borderBottom: '4px solid black' }}>
          Tutti i Corsi
        </BrutalTypography>
        {availableCourses.length === 0 ? (
          <BrutalBox sx={{ p: 4, textAlign: 'center', backgroundColor: '#f5f5f5' }}>
            <BrutalTypography sx={{ color: '#666' }}>
              Nessun corso disponibile.
            </BrutalTypography>
          </BrutalBox>
        ) : (
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 3 }}>
            {availableCourses.map(course => (
              <CourseCard
                key={course._id}
                course={course}
                enrolled={false}
                userRole={user?.role}
                actionLoading={actionLoading}
                onEnroll={handleEnroll}
                onUnenroll={handleUnenroll}
                onDelete={handleDeleteCourse}
                onOpenChat={handleOpenChat}
              />
            ))}
          </Box>
        )}
      </Box>

      <CourseChatDialog
        open={!!chatCourseId}
        courseId={chatCourseId}
        courseName={chatCourseName}
        onClose={handleCloseChat}
      />

      <CreateCourseDialog
        open={openCreateDialog}
        onClose={() => setOpenCreateDialog(false)}
        onSuccess={fetchCourses}
        userId={user?.id}
        onError={setError}
      />
    </Box>
  );
};

export default CoursesPage;
