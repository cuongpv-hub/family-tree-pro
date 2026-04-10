const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Province = sequelize.define('Province', {
  code: { type: DataTypes.INTEGER, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false }
}, { timestamps: false });

module.exports = Province;
