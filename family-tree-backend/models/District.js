const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const District = sequelize.define('District', {
  code: { type: DataTypes.INTEGER, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  provinceCode: { type: DataTypes.INTEGER, allowNull: false }
}, { timestamps: false });

module.exports = District;
