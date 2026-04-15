require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
const userRoutes = require('./routes/userRoutes');
const memberRoutes = require('./routes/memberRoutes');
const eventRoutes = require('./routes/eventRoutes');
const locationRoutes = require('./routes/locationRoutes');
const galleryRoutes = require('./routes/galleryRoutes');
const fundRoutes = require('./routes/fundRoutes');
const testReportRoutes = require('./routes/testReportRoutes');

const User = require('./models/User');
const Member = require('./models/Member');
const Event = require('./models/Event');
const Province = require('./models/Province');
const District = require('./models/District');
const Ward = require('./models/Ward');
const Gallery = require('./models/Gallery');
const FundTransaction = require('./models/FundTransaction');
const seedLocations = require('./config/seedLocations');

const app = express();

// Trung Gian Trạm Cảng
app.use(cors());
app.use(express.json());

// Điều Hướng Đường Bay Tín Hiệu Không Thép
app.use('/api/users', userRoutes);
app.use('/api/members', memberRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/locations', locationRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/funds', fundRoutes);
app.use('/api/test-report', testReportRoutes);

// Public thư mục uploads để Front-end lấy ảnh
const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const PORT = 5000;

// THUẬT TOÁN KÍCH HOẠT NHÂN THẦN SINH MỆNH
const initDB = async () => {
  try {
    // Sync an toàn - chỉ tạo bảng mới, giữ nguyên dữ liệu cũ
    await User.sync();
    await Member.sync();
    await Event.sync();
    await Province.sync();
    await District.sync();
    await Ward.sync();
    await Gallery.sync();
    await FundTransaction.sync();

    // Migration: thêm cột mới cho FundTransaction nếu chưa có
    try {
      await sequelize.query('ALTER TABLE FundTransactions ADD COLUMN category VARCHAR(255) DEFAULT NULL');
      console.log('[🔧] Đã thêm cột category vào FundTransactions');
    } catch (e) { /* Cột đã tồn tại */ }
    try {
      await sequelize.query('ALTER TABLE FundTransactions ADD COLUMN receiptImage VARCHAR(255) DEFAULT NULL');
      console.log('[🔧] Đã thêm cột receiptImage vào FundTransactions');
    } catch (e) { /* Cột đã tồn tại */ }

    // Migration cho User: thêm memberId
    try {
      await sequelize.query('ALTER TABLE Users ADD COLUMN memberId VARCHAR(255) DEFAULT NULL');
      console.log('[🔧] Đã thêm cột memberId vào Users');
    } catch (e) { /* Cột đã tồn tại */ }

    // Migration cho Member: thêm deathDate
    try {
      await sequelize.query('ALTER TABLE Members ADD COLUMN deathDate VARCHAR(255) DEFAULT NULL');
      console.log('[🔧] Đã thêm cột deathDate vào Members');
    } catch (e) { /* Cột đã tồn tại */ }
    
    const adminCount = await User.count();
    if (adminCount === 0) {
      await User.bulkCreate([
        { username: 'cuong.pham', password: '123456', role: 'ADMIN' },
        { username: 'van.pham', password: '123456', role: 'USER' }
      ]);
      console.log('[🚀] Đã Bơm Máu Gốc (User Admin/Thường)');
    }

    const memCount = await Member.count();
    if(memCount === 0) {
      // Phun Nhựa Dàn Cây Bơm Vào Đất
      await Member.bulkCreate([
        { id: '1', parentId: null, fullName: 'Ngụy Vô Tiện (Cốc Chủ)', status: 'Deceased', gender: 'Male' },
        { id: '2', parentId: '1', fullName: 'Ngụy Đình Giang', status: 'Deceased', gender: 'Male' },
        { id: '3', parentId: '1', fullName: 'Ngụy Thị Hồng', status: 'Deceased', gender: 'Female' },
        { id: '4', parentId: '2', fullName: 'Ngụy Trọng Hoàng', status: 'Alive', gender: 'Male' },
        { id: '5', parentId: '2', fullName: 'Ngụy Thị Lan', status: 'Alive', gender: 'Female' },
        { id: '6', parentId: '4', fullName: 'Ngụy Anh Tú', status: 'Alive', gender: 'Male' },
      ]);
      console.log('[🚀] Đã Bơm Sinh Mệnh Khởi Nguồn Cho Cây Tổ Tiên');
    }

    // Tiến hành gieo hạt giống dữ liệu Địa giới nếu chưa có
    await seedLocations();

    app.listen(PORT, () => {
      console.log(`[🚀] BỘ CHỈ HUY BACKEND EXPRESS ĐÃ KHỞI MỞ TẠI PHÂN ĐÀ: http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Lỗi Sập Cấu Trúc Toàn Không Gian:', error);
  }
};

initDB();
