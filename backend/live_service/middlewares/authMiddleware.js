const jwt = require('jsonwebtoken');

const requireInternalKey = (req, res, next) => {
    try {
        const internalKey = req.headers['x-internal-key'];
        const expectedKey = process.env.INTERNAL_API_KEY;
        
        if (!internalKey || internalKey !== expectedKey) {
            return res.status(403).json({ message: 'Accesso negato. Chiave interna non valida.' });
        }

        next();
    } catch (error) {
        console.error('Internal Auth error:', error.message);
        return res.status(500).json({ message: 'Errore interno del server' });
    }
};

const requireAuth = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Token mancante o formato non valido' });
        }

        const token = authHeader.split(' ')[1];
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_secret');

        req.user = decoded;
        next();
    } catch (error) {
        console.error('JWT validation error:', error.message);
        return res.status(401).json({ message: 'Token non valido o scaduto' });
    }
};

module.exports = {
    requireInternalKey,
    requireAuth
};
