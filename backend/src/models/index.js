const { Sequelize } = require('sequelize');
const sequelize = require('../config/database');

// Importer les modèles
const User = require('./User');
const Pet = require('./Pet');
const Appointment = require('./Appointment');
const Reminder = require('./Reminder');

// Définir les associations
User.hasMany(Pet, {
  foreignKey: 'userId',
  as: 'pets'
});

Pet.belongsTo(User, {
  foreignKey: 'userId',
  onDelete: 'CASCADE'
});

User.hasMany(Reminder, {
  foreignKey: 'userId',
  as: 'reminders'
});

Pet.hasMany(Reminder, {
  foreignKey: 'petId',
  as: 'reminders'
});

// Exporter les modèles
module.exports = {
  sequelize,
  Sequelize,
  User,
  Pet,
  Appointment,
  Reminder
};