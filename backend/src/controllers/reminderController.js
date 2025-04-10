const { Op } = require('sequelize');
const Pet = require('../models/Pet');
const User = require('../models/User');
const Reminder = require('../models/Reminder');
const axios = require('axios'); // Assurez-vous d'installer axios: npm install axios
require('dotenv').config();

// Récupérer tous les animaux qui nécessitent un rappel de vaccination
exports.getPetsNeedingVaccineReminders = async (req, res) => {
  try {
    // Calculer la date limite (par exemple, animaux vaccinés il y a plus de 11 mois)
    const today = new Date();
    const elevenMonthsAgo = new Date(today);
    elevenMonthsAgo.setMonth(today.getMonth() - 11);
    
    // Trouver les animaux ayant besoin d'un rappel
    const petsNeedingReminder = await Pet.findAll({
      where: {
        lastVaccination: {
          [Op.not]: null, // Avoir une date de vaccination
          [Op.lte]: elevenMonthsAgo.toISOString().split('T')[0] // Date inférieure à 11 mois
        }
      },
      include: [
        {
          model: User,
          attributes: ['id', 'firstName', 'lastName', 'email', 'phone']
        }
      ],
      order: [['lastVaccination', 'ASC']] // Les plus anciens d'abord
    });

    res.status(200).json(petsNeedingReminder);
  } catch (error) {
    console.error('Erreur de récupération des rappels de vaccination :', error);
    res.status(500).json({
      message: 'Erreur lors de la récupération des rappels de vaccination',
      error: error.message
    });
  }
};

// src/controllers/reminderController.js - Fonction modifiée

exports.sendVaccinationReminder = async (req, res) => {
  try {
    const { petId, reminderType = 'email' } = req.body;

    // Récupérer les informations de l'animal et du propriétaire
    const pet = await Pet.findOne({
      where: { id: petId },
      include: [
        {
          model: User,
          attributes: ['id', 'firstName', 'lastName', 'email', 'phone']
        }
      ]
    });

    if (!pet) {
      return res.status(404).json({ message: 'Animal non trouvé' });
    }

    // Vérifier si un rappel a déjà été envoyé récemment (dans les 30 derniers jours)
    const recentReminder = await Reminder.findOne({
      where: {
        petId,
        createdAt: {
          [Op.gte]: new Date(new Date() - 30 * 24 * 60 * 60 * 1000)
        }
      }
    });

    if (recentReminder) {
      return res.status(400).json({ 
        message: 'Un rappel a déjà été envoyé récemment pour cet animal',
        lastSent: recentReminder.createdAt
      });
    }

    // Calculer quand le vaccin arrive à expiration (1 an après la dernière vaccination)
    const lastVaccination = new Date(pet.lastVaccination);
    const expirationDate = new Date(lastVaccination);
    expirationDate.setFullYear(lastVaccination.getFullYear() + 1);
    
    const formattedExpiration = expirationDate.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });

    // Préparer le contenu du message pour EmailJS
    const emailData = {
      service_id: 'service_petscare', // Votre Service ID
      template_id: 'template_o0k79xp', // Votre Template ID
      user_id: process.env.EMAILJS_USER_ID || 'crTVa-NPrJOAzLUtq', // Votre User ID
      template_params: {
        to_name: `${pet.User.firstName} ${pet.User.lastName}`,
        to_email: pet.User.email || 'sophiezhu.pro@gmail.com', // Utiliser l'email de test si l'email de l'utilisateur n'est pas disponible
        pet_name: pet.name,
        pet_type: pet.type,
        expiration_date: formattedExpiration,
        email: pet.User.email || 'sophiezhu.pro@gmail.com', // Pour le champ Reply To
      }
    };

    // Préparer le contenu du message pour l'enregistrement dans la base de données
    const reminderContent = `Bonjour ${pet.User.firstName} ${pet.User.lastName},

Nous espérons que vous et ${pet.name} allez bien.

Nous vous contactons pour vous rappeler que le vaccin de ${pet.name} arrive à expiration le ${formattedExpiration}.

Pour assurer la santé et le bien-être de votre ${pet.type}, nous vous recommandons de prendre rendez-vous pour un rappel de vaccination.

Vous pouvez prendre rendez-vous facilement en vous connectant à votre compte PetsCare ou en nous appelant au 01 23 45 67 89.

Cordialement,
L'équipe PetsCare`;

    // Enregistrer le rappel dans la base de données
    const reminder = await Reminder.create({
      petId: pet.id,
      userId: pet.User.id,
      type: 'vaccination',
      reminderMethod: reminderType,
      status: 'envoyé',
      content: reminderContent
    });

    // Envoyer l'email avec EmailJS via leur API
    if (reminderType === 'email') {
      try {
        const response = await axios.post('https://api.emailjs.com/api/v1.0/email/send', emailData, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
        
        console.log('Email envoyé avec succès via EmailJS');
      } catch (emailError) {
        console.error('Erreur d\'envoi d\'email via EmailJS:', emailError.response?.data || emailError.message);
        // Mettre à jour le statut du rappel en cas d'erreur, mais continuer
        await reminder.update({ status: 'erreur' });
      }
    }

    res.status(200).json({
      message: 'Rappel de vaccination envoyé avec succès',
      reminder
    });
  } catch (error) {
    console.error('Erreur d\'envoi de rappel :', error);
    res.status(500).json({
      message: 'Erreur lors de l\'envoi du rappel',
      error: error.message
    });
  }
};

// Récupérer l'historique des rappels envoyés
exports.getReminderHistory = async (req, res) => {
  try {
    const reminders = await Reminder.findAll({
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
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json(reminders);
  } catch (error) {
    console.error('Erreur de récupération de l\'historique des rappels :', error);
    res.status(500).json({
      message: 'Erreur lors de la récupération de l\'historique des rappels',
      error: error.message
    });
  }
};