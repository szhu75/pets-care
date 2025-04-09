const express = require('express');
const router = express.Router();
const reminderController = require('../controllers/reminderController');
const { authMiddleware, adminMiddleware } = require('../middlewares/authMiddleware');

// Route pour récupérer les animaux nécessitant un rappel de vaccination (admin seulement)
router.get('/vaccination-needed',
  authMiddleware,
  adminMiddleware,
  reminderController.getPetsNeedingVaccineReminders
);

// Route pour envoyer un rappel de vaccination (admin seulement)
router.post('/send',
  authMiddleware,
  adminMiddleware,
  reminderController.sendVaccinationReminder
);

// Route pour récupérer l'historique des rappels envoyés (admin seulement)
router.get('/history',
  authMiddleware,
  adminMiddleware,
  reminderController.getReminderHistory
);

module.exports = router;