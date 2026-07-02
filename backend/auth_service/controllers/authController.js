const User = require('../models/User');
const TrainerCode = require('../models/TrainerCode');
const jwt = require('jsonwebtoken');


// Helper per generare l'Access Token (durata 15 minuti)
const generateAccessToken = (id, email, role) => {
  const secret = process.env.JWT_SECRET || 'TuaChiaveSegretaGlobale';
  return jwt.sign({ id, email, role }, secret, {
    expiresIn: '15m'
  });
};

// Helper per generare il Refresh Token (durata 3 ore)
const generateRefreshToken = (id) => {
  const refreshSecret = process.env.JWT_REFRESH_SECRET || 'TuaChiaveSegretaRefreshGlobale';
  return jwt.sign({ id }, refreshSecret, {
    expiresIn: '3h'
  });
};




// Registra un nuovo utente e restituisce il token JWT
exports.register = (req, res) => {
  const { firstName, lastName, birthDate, weight, height, email, password, role, inviteCode } = req.body;

  if (!firstName || !lastName || !birthDate || weight === undefined || height === undefined || !email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Tutti i campi sono obbligatori: nome, cognome, dataDiNascita, peso, altezza, email, password'
    });
  }

  const isTrainer = (role === 'trainer' || role === 'admin');
  let codeDoc = null;

  Promise.resolve()
    .then(() => {
      if (isTrainer) {
        if (!inviteCode) {
          throw new Error('CODICE_REQUIRED');
        }
        return TrainerCode.findOne({ code: inviteCode, isUsed: false })
          .then(codeFound => {
            if (!codeFound) {
              throw new Error('INVALID_CODE');
            }
            codeDoc = codeFound;
          });
      }
    })
    .then(() => {
      return User.findOne({ email });
    })
    .then(userExists => {
      if (userExists) {
        if (userExists.isActive === false) {
          return res.status(400).json({
            success: false,
            message: 'Non è possibile registrarsi con questa email in quanto eliminata dall\'owner.'
          });
        }
        return res.status(400).json({
          success: false,
          message: 'Questo indirizzo email è già registrato'
        });
      }

      const newUser = new User({
        firstName,
        lastName,
        birthDate,
        weight,
        height,
        email,
        password,
        role: isTrainer ? 'trainer' : 'user'
      });

      const accessToken = generateAccessToken(newUser._id, newUser.email, newUser.role);
      const refreshToken = generateRefreshToken(newUser._id);

      newUser.refreshToken = refreshToken;

      return newUser.save()
        .then(() => {
          if (codeDoc) {
            codeDoc.isUsed = true;
            codeDoc.usedBy = newUser._id;
            codeDoc.usedAt = new Date();
            return codeDoc.save();
          }
        })
        .then(() => {
          res.status(201).json({
            success: true,
            message: 'Registrazione completata con successo',
            accessToken,
            refreshToken,
            user: {
              id: newUser._id,
              firstName: newUser.firstName,
              lastName: newUser.lastName,
              email: newUser.email,
              role: newUser.role,
              birthDate: newUser.birthDate,
              weight: newUser.weight,
              height: newUser.height
            }
          });
        });
    })
    .catch(error => {
      if (error.message === 'CODICE_REQUIRED') {
        return res.status(400).json({
          success: false,
          message: 'Il codice di invito è obbligatorio per registrarsi come allenatore'
        });
      }
      if (error.message === 'INVALID_CODE') {
        return res.status(400).json({
          success: false,
          message: 'Codice di invito non valido o già utilizzato'
        });
      }

      console.error(`Error during registration: ${error.message}`);

      if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map(val => val.message);
        return res.status(400).json({
          success: false,
          message: 'Errore di validazione dei dati',
          errors: messages
        });
      }

      if (error.code === 11000) {
        return res.status(400).json({
          success: false,
          message: 'Questo indirizzo email è già registrato'
        });
      }
      res.status(500).json({
        success: false,
        message: 'Errore interno del server durante la registrazione. Verifica lo stato di connessione al database.',
        error: error.message
      });
    });
};




//  Autentica un utente e restituisce il token JWT
exports.login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Per favore, inserisci email e password'
    });
  }

  User.findOne({ email })
    .then(user => {
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Credenziali non valide'
        });
      }

      if (user.isActive === false) {
        return res.status(403).json({
          success: false,
          message: 'Account disabilitato.'
        });
      }

      return user.matchPassword(password)
        .then(isMatch => {
          if (!isMatch) {
            return res.status(401).json({
              success: false,
              message: 'Credenziali non valide'
            });
          }

          const accessToken = generateAccessToken(user._id, user.email, user.role);
          const refreshToken = generateRefreshToken(user._id);

          user.refreshToken = refreshToken;
          return user.save().then(() => {
            res.status(200).json({
              success: true,
              message: 'Login completato con successo',
              accessToken,
              refreshToken,
              user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role,
                birthDate: user.birthDate,
                weight: user.weight,
                height: user.height
              }
            });
          });
        });
    })
    .catch(error => {
      console.error(`Error during login: ${error.message}`);
      res.status(500).json({
        success: false,
        message: 'Errore interno del server durante il login.',
        error: error.message
      });
    });
};




// Restituisce il profilo dell'utente loggato
exports.getProfile = (req, res) => {
  const user = req.user;

  res.status(200).json({
    success: true,
    user: {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      birthDate: user.birthDate,
      weight: user.weight,
      height: user.height
    }
  });
};



// Aggiorna il profilo dell'utente loggato 
exports.updateProfile = (req, res) => {
  const { firstName, lastName, birthDate, weight, height, email } = req.body;
  const userId = req.user._id;

  const updateFields = {};
  if (firstName) updateFields.firstName = firstName;
  if (lastName) updateFields.lastName = lastName;
  if (birthDate) updateFields.birthDate = birthDate;
  if (weight !== undefined) updateFields.weight = weight;
  if (height !== undefined) updateFields.height = height;
  if (email) updateFields.email = email;


  User.findByIdAndUpdate(userId, updateFields, { new: true, runValidators: true })
    .then(updatedUser => {
      if (!updatedUser) {
        return res.status(404).json({ success: false, message: 'Utente non trovato' });
      }
      res.status(200).json({
        success: true,
        message: 'Profilo aggiornato con successo',
        user: {
          id: updatedUser._id,
          firstName: updatedUser.firstName,
          lastName: updatedUser.lastName,
          email: updatedUser.email,
          role: updatedUser.role,
          birthDate: updatedUser.birthDate,
          weight: updatedUser.weight,
          height: updatedUser.height
        }
      });
    })
    .catch(error => {
      console.error(`Error during profile update: ${error.message}`);
      res.status(500).json({ success: false, message: 'Errore interno durante l\'aggiornamento del profilo', error: error.message });
    });
};





// Effettua il logout invalidando il refresh token lato server
exports.logout = (req, res) => {
  const userId = req.user._id;

  User.findById(userId)
    .then(user => {
      if (!user) {
        return res.status(401).json({ success: false, message: 'Utente non trovato' });
      }

      user.refreshToken = null;
      return user.save().then(() => {
        res.status(200).json({
          success: true,
          message: 'Logout completato con successo. Il client deve rimuovere i token localmente.'
        });
      });
    })
    .catch(error => {
      console.error(`Error during logout: ${error.message}`);
      res.status(500).json({ success: false, message: 'Errore interno durante il logout' });
    });
};



// Cambia la password dell'utente loggato
exports.changePassword = (req, res) => {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    return res.status(400).json({ success: false, message: 'Per favore fornisci sia la vecchia che la nuova password' });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ success: false, message: 'La nuova password deve contenere almeno 6 caratteri' });
  }

  User.findById(req.user._id)
    .then(user => {
      if (!user) {
        return res.status(404).json({ success: false, message: 'Utente non trovato' });
      }

      return user.matchPassword(oldPassword).then(isMatch => {
        if (!isMatch) {
          return res.status(401).json({ success: false, message: 'La vecchia password non è corretta' });
        }

        user.password = newPassword;
        return user.save().then(() => {
          res.status(200).json({ success: true, message: 'Password aggiornata con successo' });
        });
      });
    })
    .catch(error => {
      console.error(`Error during password change: ${error.message}`);
      res.status(500).json({ success: false, message: 'Errore interno durante il cambio password' });
    });
};



// Rinnova l'access token fornendo un refresh token validos
exports.refreshToken = (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ success: false, message: 'Refresh token non fornito' });
  }

  const refreshSecret = process.env.JWT_REFRESH_SECRET || 'TuaChiaveSegretaRefreshGlobale';

  jwt.verify(refreshToken, refreshSecret, (err, decoded) => {
    if (err) {
      return res.status(403).json({ success: false, message: 'Refresh token non valido o scaduto' });
    }

    User.findById(decoded.id)
      .then(user => {
        if (!user || user.refreshToken !== refreshToken) {
          return res.status(403).json({ success: false, message: 'Refresh token non autorizzato' });
        }

        if (user.isActive === false) {
          return res.status(403).json({ success: false, message: 'Account disabilitato.' });
        }

        const newAccessToken = generateAccessToken(user._id, user.email, user.role);

        res.status(200).json({
          success: true,
          accessToken: newAccessToken
        });
      })
      .catch(error => {
        console.error(`Error during token refresh: ${error.message}`);
        res.status(500).json({ success: false, message: 'Errore interno durante il rinnovo del token' });
      });
  });
};
