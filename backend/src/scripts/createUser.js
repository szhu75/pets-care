const bcrypt = require('bcrypt');
const sequelize = require('../config/database');
const { DataTypes } = require('sequelize');

// Recréer le modèle User directement dans le script
const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  hooks: {
    beforeCreate: async (user) => {
      if (user.password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
    }
  }
});

async function createTestUser() {
  try {
    // Synchroniser le modèle
    await sequelize.sync({ force: true });

    // Créer l'utilisateur
    const user = await User.create({
      email: 'test@example.com',
      password: 'password123',
      firstName: 'John',
      lastName: 'Doe',
      phone: '0612345678'
    });

    console.log('Utilisateur de test créé :', user.toJSON());
  } catch (error) {
    console.error('Erreur de création d\'utilisateur :', error);
  } finally {
    // Fermer la connexion
    await sequelize.close();
  }
}

createTestUser();