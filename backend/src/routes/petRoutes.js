const express = require('express');
const router = express.Router();
const petController = require('../controllers/petController');
const { authMiddleware } = require('../middlewares/authMiddleware');

// Route pour créer un animal (nécessite authentification)
router.post('/create', 
  authMiddleware, 
  petController.createPet
);

// Route pour récupérer les animaux de l'utilisateur
router.get('/user', 
  authMiddleware, 
  petController.getUserPets
);

// Route pour récupérer les détails d'un animal spécifique
router.get('/:id', 
  authMiddleware, 
  petController.getPetDetails
);

// Route pour mettre à jour un animal
router.put('/:id', 
  authMiddleware, 
  petController.updatePet
);

// Route pour supprimer un animal
router.delete('/:id', 
  authMiddleware, 
  petController.deletePet
);

module.exports = router;