const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Member = sequelize.define('Member', {
  id: { type: DataTypes.STRING, primaryKey: true }, 
  parentId: { type: DataTypes.STRING, allowNull: true },
  fullName: { type: DataTypes.STRING, allowNull: false },
  gender: { type: DataTypes.STRING, defaultValue: 'Male' },
  birthDate: { type: DataTypes.STRING, allowNull: true },
  deathDate: { type: DataTypes.STRING, allowNull: true },
  status: { type: DataTypes.STRING, defaultValue: 'Alive' },
  idCard: { type: DataTypes.STRING, allowNull: true },
  hometown: { type: DataTypes.STRING, allowNull: true },
  currentAddress: { type: DataTypes.STRING, allowNull: true },
  biography: { type: DataTypes.TEXT, allowNull: true },
  avatar: { type: DataTypes.STRING, allowNull: true }
});

module.exports = Member;
