const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware d'authentification
const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: 'Aucun token fourni. Authentification requise.' });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Format de token incorrect.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'votre_secret_temporaire');

    const user = await User.findByPk(decoded.id);

    if (!user) {
      return res.status(401).json({ message: 'Utilisateur non trouvé.' });
    }

    req.user = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.email === 'test@example.com' ? 'admin' : 'user'
    };

    console.log('Utilisateur authentifié :', req.user);

    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Token invalide.' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expiré.' });
    }
    console.error('Erreur d\'authentification :', error);
    res.status(500).json({ message: 'Erreur d\'authentification.', error: error.message });
  }
};

// Middleware pour vérifier les rôles
const roleMiddleware = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: 'Accès refusé. Vous n\'avez pas les droits nécessaires.' 
      });
    }
    next();
  };
};

module.exports = {
  authMiddleware,
  adminMiddleware: roleMiddleware(['admin']) // Préconfiguration pour les admins
};
