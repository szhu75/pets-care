const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');
const { authMiddleware, adminMiddleware } = require('../middlewares/authMiddleware');

// Route pour créer un rendez-vous (nécessite authentification)
router.post('/create',
  authMiddleware,
  appointmentController.createAppointment
);

// Route pour récupérer les rendez-vous de l'utilisateur
router.get('/user',
  authMiddleware,
  appointmentController.getUserAppointments
);

// Route pour annuler un rendez-vous
router.delete('/:id',
  authMiddleware,
  appointmentController.cancelAppointment
);

module.exports = router;