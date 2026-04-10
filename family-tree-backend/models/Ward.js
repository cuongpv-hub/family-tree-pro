const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Ward = sequelize.define('Ward', {
  code: { type: DataTypes.INTEGER, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  districtCode: { type: DataTypes.INTEGER, allowNull: false }
}, { timestamps: false });

module.exports = Ward;
