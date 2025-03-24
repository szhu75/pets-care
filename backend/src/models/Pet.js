const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Pet = sequelize.define('Pet', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  type: {
    type: DataTypes.ENUM('Chien', 'Chat', 'Oiseau', 'Lapin', 'Autre'),
    allowNull: false
  },
  breed: {
    type: DataTypes.STRING,
    allowNull: true
  },
  age: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 0
    }
  },
  gender: {
    type: DataTypes.ENUM('Mâle', 'Femelle'),
    allowNull: true
  },
  weight: {
    type: DataTypes.FLOAT,
    allowNull: true,
    validate: {
      min: 0
    }
  },
  lastVaccination: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  medicalNotes: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'pets',
  timestamps: true
});

module.exports = Pet;