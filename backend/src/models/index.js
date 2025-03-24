const { Sequelize } = require('sequelize');
const sequelize = require('../config/database');

// Importer les modèles
const User = require('./User');
const Pet = require('./Pet');

// Définir les associations
User.hasMany(Pet, {
  foreignKey: 'userId',
  as: 'pets'
});

Pet.belongsTo(User, {
  foreignKey: 'userId',
  onDelete: 'CASCADE'
});

// Exporter les modèles
module.exports = {
  sequelize,
  Sequelize,
  User,
  Pet
};