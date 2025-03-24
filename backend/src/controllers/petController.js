const Pet = require('../models/Pet');
const User = require('../models/User');

// Créer un nouvel animal
exports.createPet = async (req, res) => {
  try {
    const { 
      name, 
      type, 
      breed, 
      age, 
      gender, 
      weight, 
      lastVaccination, 
      medicalNotes 
    } = req.body;
    
    const userId = req.user.id;

    // Vérifier si l'utilisateur existe
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    // Créer l'animal
    const newPet = await Pet.create({
      userId,
      name,
      type,
      breed: breed || null,
      age: age || null,
      gender: gender || null,
      weight: weight || null,
      lastVaccination: lastVaccination || null,
      medicalNotes: medicalNotes || null
    });

    res.status(201).json({
      message: 'Animal ajouté avec succès',
      pet: newPet
    });
  } catch (error) {
    console.error('Erreur de création d\'animal :', error);
    res.status(500).json({
      message: 'Erreur lors de la création de l\'animal',
      error: error.message
    });
  }
};

// Récupérer les animaux de l'utilisateur
exports.getUserPets = async (req, res) => {
  try {
    const userId = req.user.id;

    const pets = await Pet.findAll({
      where: { userId },
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json(pets);
  } catch (error) {
    console.error('Erreur de récupération des animaux :', error);
    res.status(500).json({
      message: 'Erreur lors de la récupération des animaux',
      error: error.message
    });
  }
};

// Récupérer les détails d'un animal spécifique
exports.getPetDetails = async (req, res) => {
  try {
    const petId = req.params.id;
    const userId = req.user.id;

    const pet = await Pet.findOne({
      where: { 
        id: petId,
        userId: userId 
      }
    });

    if (!pet) {
      return res.status(404).json({ message: 'Animal non trouvé' });
    }

    res.status(200).json(pet);
  } catch (error) {
    console.error('Erreur de récupération des détails de l\'animal :', error);
    res.status(500).json({
      message: 'Erreur lors de la récupération des détails de l\'animal',
      error: error.message
    });
  }
};

// Mettre à jour un animal
exports.updatePet = async (req, res) => {
  try {
    const petId = req.params.id;
    const userId = req.user.id;
    const updateData = req.body;

    // Vérifier si l'animal existe et appartient à l'utilisateur
    const pet = await Pet.findOne({
      where: { 
        id: petId,
        userId: userId 
      }
    });

    if (!pet) {
      return res.status(404).json({ message: 'Animal non trouvé' });
    }

    // Mettre à jour les informations de l'animal
    const updatedPet = await pet.update(updateData);

    res.status(200).json({
      message: 'Animal mis à jour avec succès',
      pet: updatedPet
    });
  } catch (error) {
    console.error('Erreur de mise à jour de l\'animal :', error);
    res.status(500).json({
      message: 'Erreur lors de la mise à jour de l\'animal',
      error: error.message
    });
  }
};

// Supprimer un animal
exports.deletePet = async (req, res) => {
  try {
    const petId = req.params.id;
    const userId = req.user.id;

    // Vérifier si l'animal existe et appartient à l'utilisateur
    const pet = await Pet.findOne({
      where: { 
        id: petId,
        userId: userId 
      }
    });

    if (!pet) {
      return res.status(404).json({ message: 'Animal non trouvé' });
    }

    // Supprimer l'animal
    await pet.destroy();

    res.status(200).json({
      message: 'Animal supprimé avec succès'
    });
  } catch (error) {
    console.error('Erreur de suppression de l\'animal :', error);
    res.status(500).json({
      message: 'Erreur lors de la suppression de l\'animal',
      error: error.message
    });
  }
};