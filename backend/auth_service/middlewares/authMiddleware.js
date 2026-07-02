const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Verifica la validità del token JWT per proteggere le rotte autenticate
exports.protect = (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Accesso negato: nessun token fornito',
    });
  }

  try {
    const secret = process.env.JWT_SECRET;
    const decoded = jwt.verify(token, secret);

    User.findById(decoded.id).select('-password')
      .then(user => {
        if (!user) {
          return res.status(401).json({
            success: false,
            message: 'L\'utente a cui appartiene questo token non esiste più.',
          });
        }

        req.user = user;
        next();
      })
      .catch(error => {
        console.error(`Error in protect middleware: ${error.message}`);
        return res.status(401).json({
          success: false,
          message: 'Accesso negato: token non valido',
        });
      });
  } catch (error) {
    console.error(`Error in protect middleware: ${error.message}`);
    return res.status(401).json({
      success: false,
      message: 'Accesso negato: token non valido',
    });
  }
};

// Verifica che l'utente sia un owner
exports.verifyOwner = (req, res, next) => {
  if (req.user && req.user.role === 'owner') {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: 'Accesso negato: permessi di owner richiesti.'
    });
  }
};

