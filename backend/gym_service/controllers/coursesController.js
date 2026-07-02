const Course = require('../models/Course');

// Recupera tutti i corsi
exports.getAllCourses = (req, res) => {
  const { enrolled } = req.query;
  const query = {};

  if (enrolled === 'true') {
    query.participants = req.user.id;
  }

  Course.find(query)
    .populate('instructor', 'firstName lastName')
    .then(courses => {
      res.status(200).json({
        success: true,
        data: courses
      });
    })
    .catch(error => {
      console.error(`Error retrieving courses: ${error.message}`);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    });
};

// Crea un nuovo corso
exports.createCourse = (req, res) => {
  const { name, description, instructor, days, time, duration, maxParticipants } = req.body;

  if (!name || !days || !days.length || !time || !duration) {
    return res.status(400).json({
      success: false,
      message: 'Missing required fields: name, days, time, duration'
    });
  }

  Course.create({
    name,
    description,
    instructor,
    days,
    time,
    duration,
    maxParticipants,
    participants: [req.user.id]
  })
    .then(course => {
      res.status(201).json({
        success: true,
        data: course
      });
    })
    .catch(error => {
      console.error(`Error creating course: ${error.message}`);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    });
};

// Elimina un corso
exports.deleteCourse = (req, res) => {
  const { id } = req.params;

  Course.findByIdAndDelete(id)
    .then(course => {
      if (!course) {
        return res.status(404).json({
          success: false,
          message: 'Course not found'
        });
      }
      res.status(200).json({
        success: true,
        message: 'Course deleted successfully'
      });
    })
    .catch(error => {
      console.error(`Error deleting course: ${error.message}`);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    });
};

// Iscrive l'utente loggato a un corso
exports.enrollCourse = (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  Course.findById(id)
    .then(course => {
      if (!course) {
        return res.status(404).json({
          success: false,
          message: 'Course not found'
        });
      }

      if (course.participants.length >= course.maxParticipants) {
        return res.status(409).json({
          success: false,
          message: 'Course is full'
        });
      }

      if (course.participants.includes(userId)) {
        return res.status(409).json({
          success: false,
          message: 'User already enrolled in course'
        });
      }

      course.participants.push(userId);
      return course.save();
    })
    .then(updatedCourse => {
      res.status(200).json({
        success: true,
        data: updatedCourse
      });
    })
    .catch(error => {
      console.error(`Error enrolling in course: ${error.message}`);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    });
};

// Disiscrive l'utente loggato da un corso
exports.unenrollCourse = (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  Course.findById(id)
    .then(course => {
      if (!course) {
        return res.status(404).json({
          success: false,
          message: 'Course not found'
        });
      }

      const participantIndex = course.participants.indexOf(userId);
      if (participantIndex === -1) {
        return res.status(409).json({
          success: false,
          message: 'User not enrolled in course'
        });
      }

      course.participants.splice(participantIndex, 1);
      return course.save();
    })
    .then(updatedCourse => {
      res.status(200).json({
        success: true,
        data: updatedCourse
      });
    })
    .catch(error => {
      console.error(`Error unenrolling from course: ${error.message}`);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    });
};

// Recupera i messaggi di un corso
exports.getCourseMessages = (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Course messages endpoint',
    data: []
  });
};
