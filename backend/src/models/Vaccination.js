const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Pet = require('./Pet');

const Vaccination = sequelize.define('Vaccination', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  petId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Pet,
      key: 'id'
    }
  },
  vaccineName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  vaccineDate: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  expiryDate: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  veterinarian: {
    type: DataTypes.STRING,
    allowNull: true
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'vaccinations',
  timestamps: true
});

// Association avec le modèle Pet
Vaccination.belongsTo(Pet, {
  foreignKey: 'petId',
  onDelete: 'CASCADE'
});

module.exports = Vaccination;