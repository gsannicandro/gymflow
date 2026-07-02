import apiClient from './axios';

export const gymApi = {
  // Corsi
  getCourses: () => apiClient.get('/v1/gym/courses'),
  getMyCourses: () => apiClient.get('/v1/gym/courses?enrolled=true'),
  createCourse: (courseData) => apiClient.post('/v1/gym/courses', courseData),
  deleteCourse: (courseId) => apiClient.delete(`/v1/gym/courses/${courseId}`),
  enrollCourse: (courseId) => apiClient.post(`/v1/gym/courses/${courseId}/enrollments`),
  unenrollCourse: (courseId) => apiClient.delete(`/v1/gym/courses/${courseId}/enrollments`),

  // Macchine
  getMachines: () => apiClient.get('/v1/gym/machines'),
  useMachine: (machineId) => apiClient.post(`/v1/gym/machines/${machineId}/session`),
  releaseMachine: (machineId) => apiClient.delete(`/v1/gym/machines/${machineId}/session`),
  joinQueue: (machineId) => apiClient.post(`/v1/gym/machines/${machineId}/queue`),
  leaveQueue: (machineId) => apiClient.delete(`/v1/gym/machines/${machineId}/queue`),


  // Schede
  generateWorkout: () => apiClient.post('/v1/gym/workouts'),
  getWorkouts: (status) => apiClient.get('/v1/gym/workouts', { params: { status } }),
  markExerciseComplete: (workoutId, exerciseId) => 
    apiClient.patch(`/v1/gym/workouts/${workoutId}/exercises/${exerciseId}`, { completed: true })
};
