const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME || 'pets_care',     // Nom de la base de données
  process.env.DB_USER || 'root',          // Votre nom d'utilisateur MySQL
  process.env.DB_PASSWORD || 'root',          // Votre mot de passe
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mysql',
    logging: console.log,  // Activez les logs pour le débogage
    define: {
      timestamps: true
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

module.exports = sequelize;