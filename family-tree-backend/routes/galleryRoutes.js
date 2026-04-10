const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Gallery = require('../models/Gallery');
const fs = require('fs');

// Cấu hình Multer để lưu file vào thư mục 'uploads'
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '..', 'uploads');
    // Đảm bảo thư mục tồn tại
    if (!fs.existsSync(uploadPath)){
        fs.mkdirSync(uploadPath);
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + ext);
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 } // Giới hạn 10MB
});

// Lấy danh sách ảnh với tham số Query
router.get('/', async (req, res) => {
  try {
    const { userId, role } = req.query;
    const { Op } = require('sequelize');

    let whereClause = {};

    // Admin xem tất cả. Người thường chỉ xem được cái Công khai hoăc Riêng tư của chính mình.
    if (role !== 'ADMIN') {
      whereClause = {
        [Op.or]: [
          { isShared: true },
          { uploaderId: userId || null }
        ]
      };
    }

    const photos = await Gallery.findAll({
      where: whereClause,
      order: [['uploadedAt', 'DESC']]
    });
    res.json(photos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Lỗi khi lấy danh sách ảnh.' });
  }
});

// Upload ảnh mới
router.post('/', upload.single('photo'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Vui lòng chọn ảnh.' });
    }
    
    // Lưu URL tương đối để client dễ dàng lấy file
    const imageUrl = `/uploads/${req.file.filename}`;
    const newId = 'img_' + Date.now();
    
    const newPhoto = await Gallery.create({
      id: newId,
      imageUrl: imageUrl,
      note: req.body.note || '',
      uploaderId: req.body.uploaderId || null,
      uploaderName: req.body.uploaderName || null,
      isShared: req.body.isShared === 'false' ? false : true // default is true
    });
    
    res.status(201).json({ success: true, photo: newPhoto });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Lỗi server khi upload ảnh.' });
  }
});

// Xóa ảnh
router.delete('/:id', async (req, res) => {
  try {
    const photo = await Gallery.findByPk(req.params.id);
    if (!photo) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy ảnh.' });
    }
    
    // Xóa file vật lý
    const filePath = path.join(__dirname, '..', photo.imageUrl);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    
    await photo.destroy();
    res.json({ success: true, message: 'Đã xóa ảnh.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Lỗi server khi xóa ảnh.' });
  }
});

module.exports = router;
