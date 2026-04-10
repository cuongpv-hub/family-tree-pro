const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Gallery = sequelize.define('Gallery', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  note: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  uploadedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  uploaderId: {
    type: DataTypes.UUID,
    allowNull: true
  },
  uploaderName: {
    type: DataTypes.STRING,
    allowNull: true
  },
  isShared: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
});

module.exports = Gallery;
