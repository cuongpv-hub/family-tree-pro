const express = require('express');
const router = express.Router();
const Event = require('../models/Event');

// Lấy toàn bộ sự kiện (Sắp xếp theo ngày gần nhất nếu có thể, hoặc ID)
router.get('/', async (req, res) => {
  try {
    const events = await Event.findAll();
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server khi lấy dữ liệu sự kiện', error: error.message });
  }
});

// Tạo sự kiện mới
router.post('/', async (req, res) => {
  try {
    const newEvent = await Event.create(req.body);
    res.status(201).json(newEvent);
  } catch (error) {
    res.status(400).json({ message: 'Tạo mới sự kiện thất bại', error: error.message });
  }
});

// Cập nhật sự kiện
router.put('/:id', async (req, res) => {
  try {
    const evt = await Event.findByPk(req.params.id);
    if (evt) {
      await evt.update(req.body);
      res.json(evt);
    } else {
      res.status(404).json({ message: 'Không tìm thấy sự kiện' });
    }
  } catch (error) {
    res.status(400).json({ message: 'Cập nhật thất bại', error: error.message });
  }
});

// Xóa sự kiện
router.delete('/:id', async (req, res) => {
  try {
    const evt = await Event.findByPk(req.params.id);
    if (evt) {
      await evt.destroy();
      res.json({ message: 'Đã xóa thành công sự kiện' });
    } else {
      res.status(404).json({ message: 'Không tìm thấy sự kiện' });
    }
  } catch (error) {
    res.status(400).json({ message: 'Xóa sự kiện thất bại', error: error.message });
  }
});

module.exports = router;
