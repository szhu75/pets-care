const express = require('express');
const router = express.Router();
const vaccinationController = require('../controllers/vaccinationController');
const { authMiddleware, adminMiddleware } = require('../middlewares/authMiddleware');

// Route pour ajouter une vaccination (nécessite authentification)
router.post('/add',
  authMiddleware,
  vaccinationController.addVaccination
);

// Route pour récupérer les vaccinations d'un animal spécifique
router.get('/pet/:petId',
  authMiddleware,
  vaccinationController.getPetVaccinations
);

// Route pour récupérer le passeport d'un animal (détails + vaccinations)
router.get('/passport/:petId',
  authMiddleware,
  vaccinationController.getPetPassport
);

// Route pour supprimer une vaccination
router.delete('/:id',
  authMiddleware,
  vaccinationController.deleteVaccination
);

module.exports = router;