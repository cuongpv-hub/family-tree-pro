const express = require('express');
const router = express.Router();
const User = require('../models/User');

// GET all users
router.get('/', async (req, res) => {
  const users = await User.findAll();
  res.json(users);
});

// POST add user
router.post('/', async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.json({ success: true, user });
  } catch (err) {
    if(err.name === 'SequelizeUniqueConstraintError') {
      res.status(400).json({ success: false, message: 'Bí Danh Ám Sát này đã có Chủ!' });
    } else {
      res.status(400).json({ success: false, message: err.message });
    }
  }
});

// PUT edit user
router.put('/:id', async (req, res) => {
  try {
    await User.update(req.body, { where: { id: req.params.id } });
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// DELETE User
router.delete('/:id', async (req, res) => {
  try {
    await User.destroy({ where: { id: req.params.id }});
    res.json({ success: true });
  } catch(err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// KHẨU KHUYẾT XÁC THỰC LÕI (MOCK LOGIN)
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ where: { username, password } });
  if (user) {
    res.json({ success: true, user: {id: user.id, username: user.username, role: user.role} });
  } else {
    res.json({ success: false, message: 'Triện Cung Đinh - Ấn Tính Sai Lệch' });
  }
});

module.exports = router;
