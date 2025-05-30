const express = require('express');
const router = express.Router();
const { authMiddleware, adminMiddleware } = require('../middlewares/authMiddleware');
const User = require('../models/User');
const Pet = require('../models/Pet');
const Appointment = require('../models/Appointment');
const { Op } = require('sequelize');

// Route pour obtenir les statistiques globales (nécessite authentification admin)
router.get('/stats', 
  authMiddleware, 
  adminMiddleware, 
  async (req, res) => {
    try {
      const stats = {
        totalUsers: await User.count(),
        totalPets: await Pet.count(),
        totalAppointments: await Appointment.count(),
        pendingAppointments: await Appointment.count({
          where: { status: 'En cours' }
        }),
        upcomingAppointments: await Appointment.findAll({
          where: {
            date: {
              [Op.gte]: new Date() // Rendez-vous futurs
            },
            status: {
              [Op.notIn]: ['Annulé', 'Terminé']
            }
          },
          include: [
            {
              model: Pet,
              attributes: ['name', 'type']
            }
          ],
          order: [['date', 'ASC']],
          limit: 10
        })
      };

      res.status(200).json(stats);
    } catch (error) {
      console.error('Erreur de récupération des statistiques :', error);
      res.status(500).json({ 
        message: 'Erreur lors de la récupération des statistiques',
        error: error.message 
      });
    }
  }
);

// Route pour récupérer tous les utilisateurs (admin uniquement)
router.get('/users', 
  authMiddleware, 
  adminMiddleware, 
  async (req, res) => {
    try {
      const users = await User.findAll({
        attributes: { 
          exclude: ['password'] 
        },
        include: [
          {
            model: Pet,
            as: 'pets'
          }
        ]
      });

      res.status(200).json(users);
    } catch (error) {
      console.error('Erreur de récupération des utilisateurs :', error);
      res.status(500).json({ 
        message: 'Erreur lors de la récupération des utilisateurs',
        error: error.message 
      });
    }
  }
);

// Route pour récupérer tous les rendez-vous
router.get('/appointments', 
  authMiddleware, 
  adminMiddleware, 
  async (req, res) => {
    try {
      const appointments = await Appointment.findAll({
        include: [
          {
            model: Pet,
            attributes: ['name', 'type']
          },
          {
            model: User,
            attributes: ['firstName', 'lastName', 'email']
          }
        ],
        order: [['date', 'DESC']]
      });

      res.status(200).json(appointments);
    } catch (error) {
      console.error('Erreur de récupération des rendez-vous :', error);
      res.status(500).json({ 
        message: 'Erreur lors de la récupération des rendez-vous',
        error: error.message 
      });
    }
  }
);

// Route pour récupérer tous les animaux
router.get('/pets', 
  authMiddleware, 
  adminMiddleware, 
  async (req, res) => {
    try {
      const pets = await Pet.findAll({
        include: [
          {
            model: User,
            attributes: ['firstName', 'lastName', 'email']
          }
        ],
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
  }
);

module.exports = router;