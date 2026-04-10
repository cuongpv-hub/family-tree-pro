const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const FundTransaction = sequelize.define('FundTransaction', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  type: {
    type: DataTypes.ENUM('IN', 'OUT'),
    allowNull: false,
    defaultValue: 'IN',
  },
  amount: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  category: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: 'Khác',
  },
  receiptImage: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  transactionDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  memberId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  recorderName: {
    type: DataTypes.STRING,
    allowNull: true,
  }
});

module.exports = FundTransaction;
