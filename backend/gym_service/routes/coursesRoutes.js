const express = require('express');
const router = express.Router();
const coursesController = require('../controllers/coursesController');
const { protect, verifyTrainerOrOwner } = require('../middlewares/authMiddleware');

// Recupera tutti i corsi (supporta ?enrolled=true per recuperare i corsi dell'utente)
router.get('/', protect, coursesController.getAllCourses);

// Crea un nuovo corso (solo trainer o owner)
router.post('/', protect, verifyTrainerOrOwner, coursesController.createCourse);

// Elimina un corso (solo trainer o owner)
router.delete('/:id', protect, verifyTrainerOrOwner, coursesController.deleteCourse);

// Iscrive un utente a un corso
router.post('/:id/enrollments', protect, coursesController.enrollCourse);

// Disiscrive un utente da un corso
router.delete('/:id/enrollments', protect, coursesController.unenrollCourse);

// Recupera la cronologia dei messaggi di un corso (solo per utenti iscritti)
router.get('/:id/messages', protect, coursesController.getCourseMessages);

module.exports = router;