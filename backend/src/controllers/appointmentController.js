const Appointment = require('../models/Appointment');
const Pet = require('../models/Pet');
const { Op } = require('sequelize');

// Mappeurs pour les types et statuts
const typeMapping = {
  'health_check': 'Contrôle de santé',
  'vaccination': 'Vaccination',
  'consultation': 'Consultation',
  'emergency': 'Urgence'
};

const reverseTypeMapping = {
  'Contrôle de santé': 'health_check',
  'Vaccination': 'vaccination',
  'Consultation': 'consultation',
  'Urgence': 'emergency'
};

const statusMapping = {
  'pending': 'En cours',
  'confirmed': 'Confirmé',
  'completed': 'Terminé',
  'cancelled': 'Annulé'
};

const reverseStatusMapping = {
  'En cours': 'pending',
  'Confirmé': 'confirmed',
  'Terminé': 'completed',
  'Annulé': 'cancelled'
};

// Créer un nouveau rendez-vous
exports.createAppointment = async (req, res) => {
  try {
    const { petId, type, date, time, notes } = req.body;
    const userId = req.user.id;

    // Convertir le type en français si nécessaire
    const formattedType = typeMapping[type] || type;

    // Vérifier si le pet appartient à l'utilisateur
    const pet = await Pet.findOne({
      where: {
        id: petId,
        userId: userId
      }
    });

    if (!pet) {
      return res.status(403).json({ message: 'Animal non trouvé ou non autorisé' });
    }

    // Vérifier s'il n'y a pas de conflit de rendez-vous
    const existingAppointment = await Appointment.findOne({
      where: {
        petId,
        date,
        time,
        status: {
          [Op.notIn]: ['Annulé', 'Terminé']
        }
      }
    });

    if (existingAppointment) {
      return res.status(400).json({ message: 'Un rendez-vous existe déjà à ce moment' });
    }

    // Créer le rendez-vous
    const newAppointment = await Appointment.create({
      userId,
      petId,
      type: formattedType,
      date,
      time,
      notes: notes || null,
    });

    res.status(201).json({
      message: 'Rendez-vous créé avec succès',
      appointment: newAppointment
    });
  } catch (error) {
    console.error('Erreur de création de rendez-vous :', error);
    res.status(500).json({
      message: 'Erreur lors de la création du rendez-vous',
      error: error.message
    });
  }
};

// Récupérer les rendez-vous de l'utilisateur
exports.getUserAppointments = async (req, res) => {
  try {
    const userId = req.user.id;

    const appointments = await Appointment.findAll({
      where: {
        userId,
        status: {
          [Op.notIn]: ['Annulé']
        }
      },
      include: [
        {
          model: Pet,
          attributes: ['name', 'type']
        }
      ],
      order: [['date', 'ASC'], ['time', 'ASC']]
    });

    // Formater les rendez-vous avec le nom de l'animal
    const formattedAppointments = appointments.map(app => ({
      id: app.id,
      petName: app.Pet.name,
      petType: app.Pet.type,
      type: app.type,
      date: app.date,
      time: app.time,
      notes: app.notes,
      status: app.status
    }));

    res.status(200).json(formattedAppointments);
  } catch (error) {
    console.error('Erreur de récupération des rendez-vous :', error);
    res.status(500).json({
      message: 'Erreur lors de la récupération des rendez-vous',
      error: error.message
    });
  }
};

// Annuler un rendez-vous
exports.cancelAppointment = async (req, res) => {
  try {
    const appointmentId = req.params.id;
    const userId = req.user.id;

    // Vérifier si le rendez-vous appartient à l'utilisateur
    const appointment = await Appointment.findOne({
      where: {
        id: appointmentId,
        userId: userId
      }
    });

    if (!appointment) {
      return res.status(404).json({ message: 'Rendez-vous non trouvé' });
    }

    // Vérifier si le rendez-vous peut être annulé
    const appointmentDate = new Date(`${appointment.date}T${appointment.time}`);
    if (appointmentDate < new Date()) {
      return res.status(400).json({ message: 'Impossible d\'annuler un rendez-vous passé' });
    }

    // Mettre à jour le statut du rendez-vous
    appointment.status = 'Annulé';
    await appointment.save();

    res.status(200).json({
      message: 'Rendez-vous annulé avec succès',
      appointment: appointment
    });
  } catch (error) {
    console.error('Erreur d\'annulation du rendez-vous :', error);
    res.status(500).json({
      message: 'Erreur lors de l\'annulation du rendez-vous',
      error: error.message
    });
  }
};