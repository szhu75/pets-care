const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');
const Pet = require('./Pet');

const Appointment = sequelize.define('Appointment', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },
  petId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Pet,
      key: 'id'
    }
  },
  type: {
    type: DataTypes.ENUM('Contrôle de santé', 'Vaccination', 'Consultation', 'Urgence'),
    allowNull: false
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    validate: {
      isDate: true,
      isAfter: new Date().toISOString().split('T')[0] // Date future uniquement
    }
  },
  time: {
    type: DataTypes.TIME,
    allowNull: false
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('En cours', 'Confirmé', 'Terminé', 'Annulé'),
    defaultValue: 'En cours'
  }
}, {
  tableName: 'appointments',
  timestamps: true,
  hooks: {
    // Hook pour mettre à jour le statut automatiquement
    beforeCreate: (appointment) => {
      const appointmentDateTime = new Date(`${appointment.date}T${appointment.time}`);
      const now = new Date();
     
      if (appointmentDateTime < now) {
        appointment.status = 'Terminé';
      }
    }
  }
});

// Associations
Appointment.belongsTo(User, {
  foreignKey: 'userId',
  onDelete: 'CASCADE'
});

Appointment.belongsTo(Pet, {
  foreignKey: 'petId',
  onDelete: 'CASCADE'
});

module.exports = Appointment;