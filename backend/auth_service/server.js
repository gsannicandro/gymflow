const path = require('path');
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const ownerRoutes = require('./routes/ownerRoutes');
const PORT = process.env.PORT || 5001;

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Auth Service attivo e funzionante',
    timestamp: new Date()
  });
});

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/auth/owner', ownerRoutes);

app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Risorsa non trovata: ${req.originalUrl}`
  });
});

// Middleware gestione errori
app.use((err, req, res, next) => {
  console.error(`[Error Middleware] Unhandled error: ${err.message}`);
  res.status(500).json({
    success: false,
    message: 'Errore interno del server',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

app.listen(PORT, () => {
  console.log(`Auth Service started on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
});
