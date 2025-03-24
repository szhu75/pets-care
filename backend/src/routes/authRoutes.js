const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Route pour l'inscription
router.post('/register', async (req, res) => {
  try {
    const { firstName, lastName, email, phone, password } = req.body;

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Un compte avec cet email existe déjà' });
    }

    // Créer un nouvel utilisateur
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      firstName,
      lastName,
      email,
      phone: phone || null,
      password: hashedPassword
    });

    // Générer un token JWT
    const token = jwt.sign(
      {
        id: newUser.id,
        email: newUser.email
      },
      process.env.JWT_SECRET || 'votre_secret_temporaire',
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'Inscription réussie',
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName
      }
    });
  } catch (error) {
    console.error('Erreur d\'inscription :', error);
    res.status(500).json({
      message: 'Erreur serveur lors de l\'inscription',
      error: error.message
    });
  }
});

// Route de connexion (existante)
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Login attempt:', { email, password });

    // Rechercher l'utilisateur
    const user = await User.findOne({ where: { email } });

    // Vérifier si l'utilisateur existe
    if (!user) {
      console.log('Utilisateur non trouvé');
      return res.status(401).json({ message: 'Utilisateur non trouvé' });
    }

    // Vérifier le mot de passe
    const isMatch = await bcrypt.compare(password, user.password);
    console.log('Password verification:', {
      inputPassword: password,
      storedHashedPassword: user.password,
      isMatch: isMatch
    });

    if (!isMatch) {
      console.log('Mot de passe incorrect');
      return res.status(401).json({ message: 'Mot de passe incorrect' });
    }

    // Générer un token JWT
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email
      },
      process.env.JWT_SECRET || 'votre_secret_temporaire',
      { expiresIn: '24h' }
    );

    res.status(200).json({
      message: 'Connexion réussie',
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName
      }
    });
  } catch (error) {
    console.error('Erreur de connexion :', error);
    res.status(500).json({
      message: 'Erreur serveur lors de la connexion',
      error: error.message
    });
  }
});

// Route pour réinitialiser/créer un utilisateur de test
router.post('/reset-test-user', async (req, res) => {
  try {
    // Supprimer l'utilisateur existant s'il existe
    await User.destroy({ where: { email: 'test@example.com' } });

    // Créer un nouvel utilisateur avec un mot de passe haché
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);
    const newUser = await User.create({
      email: 'test@example.com',
      password: hashedPassword,
      firstName: 'John',
      lastName: 'Doe',
      phone: '0612345678'
    });

    res.status(201).json({
      message: 'Utilisateur de test recréé',
      user: {
        email: newUser.email,
        firstName: newUser.firstName
      }
    });
  } catch (error) {
    console.error('Erreur de réinitialisation :', error);
    res.status(500).json({
      message: 'Erreur lors de la réinitialisation',
      error: error.message
    });
  }
});

module.exports = router;