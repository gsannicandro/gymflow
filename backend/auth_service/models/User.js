const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'Il nome è obbligatorio'],
    trim: true
  },
  lastName: {
    type: String,
    required: [true, 'Il cognome è obbligatorio'],
    trim: true
  },
  birthDate: {
    type: Date,
    required: [true, 'La data di nascita è obbligatoria']
  },
  weight: {
    type: Number,
    required: [true, 'Il peso è obbligatorio'],
    min: [0, 'Il peso non può essere negativo']
  },
  height: {
    type: Number,
    required: [true, 'L\'altezza è obbligatoria'],
    min: [0, 'L\'altezza non può essere negativa']
  },
  email: {
    type: String,
    required: [true, 'L\'email è obbligatoria'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Inserisci un indirizzo email valido'
    ]
  },
  password: {
    type: String,
    required: [true, 'La password è obbligatoria'],
    minlength: [6, 'La password deve contenere almeno 6 caratteri']
  },
  role: {
    type: String,
    enum: ['user', 'trainer', 'owner'],
    default: 'user'
  },
  refreshToken: {
    type: String,
    default: null
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Middleware di mongoose pre-save: crittografa la password prima di salvarla nel DB
UserSchema.pre('save', function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  bcrypt.genSalt(10)
    .then(salt => {
      return bcrypt.hash(this.password, salt);
    })
    .then(hash => {
      this.password = hash;
      next();
    })
    .catch(error => {
      next(error);
    });
});

// Metodo d'istanza per confrontare la password inserita con quella memorizzata nel DB
UserSchema.methods.matchPassword = function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);