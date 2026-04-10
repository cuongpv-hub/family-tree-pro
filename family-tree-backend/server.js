const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
const userRoutes = require('./routes/userRoutes');
const memberRoutes = require('./routes/memberRoutes');
const eventRoutes = require('./routes/eventRoutes');
const locationRoutes = require('./routes/locationRoutes');
const galleryRoutes = require('./routes/galleryRoutes');

const User = require('./models/User');
const Member = require('./models/Member');
const Event = require('./models/Event');
const Province = require('./models/Province');
const District = require('./models/District');
const Ward = require('./models/Ward');
const Gallery = require('./models/Gallery');
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

// Public thư mục uploads để Front-end lấy ảnh
const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const PORT = 5000;

// THUẬT TOÁN KÍCH HOẠT NHÂN THẦN SINH MỆNH
const initDB = async () => {
  try {
    await sequelize.sync({ alter: true }); // Lệnh Rút Gươm Tạo Lò Bát Quái Data
    
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
