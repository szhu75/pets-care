const sequelize = require('../config/database');
const User = require('../models/User');
const bcrypt = require('bcrypt');

async function createTestUser() {
  try {
    // Synchroniser la base de données
    await sequelize.sync({ force: true }); // force: true va recréer les tables

    // Hacher le mot de passe
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    // Créer l'utilisateur
    const user = await User.create({
      email: 'test@example.com',
      password: hashedPassword,
      firstName: 'John',
      lastName: 'Doe',
      phone: '0612345678'
    });

    console.log('Utilisateur créé avec succès :', user.toJSON());
  } catch (error) {
    console.error('Erreur lors de la création de l\'utilisateur :', error);
  } finally {
    // Fermer la connexion
    await sequelize.close();
  }
}

createTestUser();