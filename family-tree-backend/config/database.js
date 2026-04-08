const { Sequelize } = require('sequelize');
const path = require('path');

// Triệu hồi Ma Trận SQLite
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '../family_tree.sqlite'), // Quả tim SQLite nặng bằng Quả Trứng! Tốc độ ánh sáng
  logging: false, // Dừng báo cáo Query dư thừa ra màn hình
});

module.exports = sequelize;
