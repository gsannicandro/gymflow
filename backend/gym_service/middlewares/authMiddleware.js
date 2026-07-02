const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = mongoose.model('User');

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({ success: false, message: 'Accesso negato: Nessun token fornito.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        const user = await User.findById(decoded.id);
        if (!user || user.isActive === false) {
            return res.status(403).json({ success: false, message: 'USER_INACTIVE' });
        }

        req.user = { id: user._id, role: user.role };
        next();
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ success: false, message: 'Token scaduto. Effettua nuovamente il login.' });
        }
        return res.status(401).json({ success: false, message: 'Token non valido o corrotto.' });
    }
};

// Verifica che l'utente sia un owner
const verifyOwner = (req, res, next) => {
    if (req.user && req.user.role === 'owner') {
        next();
    } else {
        res.status(403).json({ success: false, message: 'Access denied: Owner permissions required.' });
    }
};

// Verifica che l'utente sia un trainer o un owner
const verifyTrainerOrOwner = (req, res, next) => {
    if (req.user && ['trainer', 'owner'].includes(req.user.role)) {
        next();
    } else {
        res.status(403).json({ success: false, message: 'Access denied: Trainer or Owner permissions required.' });
    }
};

module.exports = { protect, verifyOwner, verifyTrainerOrOwner };