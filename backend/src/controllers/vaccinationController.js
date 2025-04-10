const Vaccination = require('../models/Vaccination');
const Pet = require('../models/Pet');
const User = require('../models/User');

// Ajouter une vaccination pour un animal spécifique
exports.addVaccination = async (req, res) => {
  try {
    const { petId, vaccineName, vaccineDate, expiryDate, veterinarian, notes } = req.body;
    const userId = req.user.id;

    // Vérifier si l'animal appartient à l'utilisateur
    const pet = await Pet.findOne({
      where: {
        id: petId,
        userId: userId
      }
    });

    if (!pet) {
      return res.status(403).json({ message: 'Animal non trouvé ou non autorisé' });
    }

    // Créer la vaccination
    const newVaccination = await Vaccination.create({
      petId,
      vaccineName,
      vaccineDate,
      expiryDate: expiryDate || null,
      veterinarian: veterinarian || null,
      notes: notes || null
    });

    // Si c'est le vaccin le plus récent, mettre à jour la date de dernière vaccination de l'animal
    const lastVaccinationDate = new Date(vaccineDate);
    if (!pet.lastVaccination || new Date(pet.lastVaccination) < lastVaccinationDate) {
      await pet.update({ lastVaccination: vaccineDate });
    }

    res.status(201).json({
      message: 'Vaccination ajoutée avec succès',
      vaccination: newVaccination
    });
  } catch (error) {
    console.error('Erreur d\'ajout de vaccination :', error);
    res.status(500).json({
      message: 'Erreur lors de l\'ajout de la vaccination',
      error: error.message
    });
  }
};

// Récupérer toutes les vaccinations d'un animal
exports.getPetVaccinations = async (req, res) => {
  try {
    const petId = req.params.petId;
    const userId = req.user.id;

    // Vérifier si l'animal appartient à l'utilisateur
    const pet = await Pet.findOne({
      where: {
        id: petId,
        userId: userId
      }
    });

    if (!pet && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Animal non trouvé ou non autorisé' });
    }

    // Récupérer les vaccinations de l'animal
    const vaccinations = await Vaccination.findAll({
      where: {
        petId: petId
      },
      order: [['vaccineDate', 'DESC']]
    });

    res.status(200).json(vaccinations);
  } catch (error) {
    console.error('Erreur de récupération des vaccinations :', error);
    res.status(500).json({
      message: 'Erreur lors de la récupération des vaccinations',
      error: error.message
    });
  }
};

// Récupérer le passeport complet d'un animal (détails animal + vaccinations)
exports.getPetPassport = async (req, res) => {
  try {
    const petId = req.params.petId;
    const userId = req.user.id;

    // Vérifier si l'animal appartient à l'utilisateur ou si c'est un admin
    const pet = await Pet.findOne({
      where: req.user.role === 'admin' ? { id: petId } : { id: petId, userId: userId },
      include: [
        {
          model: User,
          attributes: ['firstName', 'lastName', 'email', 'phone']
        }
      ]
    });

    if (!pet) {
      return res.status(404).json({ message: 'Animal non trouvé ou non autorisé' });
    }

    // Récupérer les vaccinations de l'animal
    const vaccinations = await Vaccination.findAll({
      where: {
        petId: petId
      },
      order: [['vaccineDate', 'DESC']]
    });

    // Créer et retourner le passeport
    const passport = {
      pet: {
        id: pet.id,
        name: pet.name,
        type: pet.type,
        breed: pet.breed,
        age: pet.age,
        gender: pet.gender,
        weight: pet.weight,
        lastVaccination: pet.lastVaccination,
        medicalNotes: pet.medicalNotes,
        createdAt: pet.createdAt
      },
      owner: pet.User ? {
        firstName: pet.User.firstName,
        lastName: pet.User.lastName,
        email: pet.User.email,
        phone: pet.User.phone
      } : null,
      vaccinations: vaccinations
    };

    res.status(200).json(passport);
  } catch (error) {
    console.error('Erreur de récupération du passeport :', error);
    res.status(500).json({
      message: 'Erreur lors de la récupération du passeport',
      error: error.message
    });
  }
};

// Supprimer une vaccination
exports.deleteVaccination = async (req, res) => {
  try {
    const vaccinationId = req.params.id;
    const userId = req.user.id;

    // Récupérer la vaccination
    const vaccination = await Vaccination.findByPk(vaccinationId, {
      include: [
        {
          model: Pet,
          where: req.user.role === 'admin' ? {} : { userId: userId }
        }
      ]
    });

    if (!vaccination) {
      return res.status(404).json({ message: 'Vaccination non trouvée ou non autorisée' });
    }

    // Supprimer la vaccination
    await vaccination.destroy();

    // Vérifier si nous devons mettre à jour la date de dernière vaccination de l'animal
    if (vaccination.Pet && vaccination.Pet.lastVaccination === vaccination.vaccineDate) {
      // Trouver la vaccination la plus récente pour cet animal
      const latestVaccination = await Vaccination.findOne({
        where: {
          petId: vaccination.petId
        },
        order: [['vaccineDate', 'DESC']]
      });

      // Mettre à jour la date de dernière vaccination
      await vaccination.Pet.update({
        lastVaccination: latestVaccination ? latestVaccination.vaccineDate : null
      });
    }

    res.status(200).json({
      message: 'Vaccination supprimée avec succès'
    });
  } catch (error) {
    console.error('Erreur de suppression de vaccination :', error);
    res.status(500).json({
      message: 'Erreur lors de la suppression de la vaccination',
      error: error.message
    });
  }
};