const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');
const Pet = require('./Pet');

const Reminder = sequelize.define('Reminder', {
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
    type: DataTypes.ENUM('vaccination', 'checkup', 'other'),
    allowNull: false
  },
  reminderMethod: {
    type: DataTypes.ENUM('email', 'sms', 'both'),
    defaultValue: 'email',
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('envoyé', 'lu', 'rév_pris', 'ignoré'),
    defaultValue: 'envoyé',
    allowNull: false
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  readAt: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'reminders',
  timestamps: true
});

// Associations
Reminder.belongsTo(User, {
  foreignKey: 'userId',
  onDelete: 'CASCADE'
});

Reminder.belongsTo(Pet, {
  foreignKey: 'petId',
  onDelete: 'CASCADE'
});

module.exports = Reminder;