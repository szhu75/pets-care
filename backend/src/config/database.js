const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  'pets_care',      // Nom de la base de données 
  'Sophie',         // Nom d'utilisateur MySQL
  '4321567Sl.8992',// Votre mot de passe MySQL
  {
    host: 'localhost',
    port: 3306,
    dialect: 'mysql',
    logging: console.log,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    define: {
      timestamps: true,
      underscored: true
    }
  }
);

// Tester la connexion
async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('Connexion à la base de données réussie.');
  } catch (error) {
    console.error('Impossible de se connecter à la base de données :', error);
  }
}

testConnection();

module.exports = sequelize;