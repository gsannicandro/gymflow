const express = require('express'); 
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

require('./models/User');

const PORT = process.env.PORT || 5002;

connectDB();

const app = express();
app.use(cors());
app.use(express.json());

const coursesRouter = require('./routes/coursesRoutes');
const workoutsRouter = require('./routes/workoutsRoutes');
const machinesRouter = require('./routes/machinesRoutes');
const bookingsRouter = require('./routes/bookingsRoutes');

app.use('/api/v1/gym/courses', coursesRouter);
app.use('/api/v1/gym/workouts', workoutsRouter);
app.use('/api/v1/gym/machines', machinesRouter);
app.use('/api/v1/gym/bookings', bookingsRouter);

// Middleware per le rotte non trovate
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Risorsa non trovata: ${req.originalUrl}`
  });
});

app.listen(PORT, () => {
  console.log(`Gym Service started on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
});