const express = require('express');
const router = express.Router();
const Member = require('../models/Member');
const User = require('../models/User');

router.get('/', async (req, res) => {
  const members = await Member.findAll();
  res.json(members);
});

router.post('/', async (req, res) => {
  try {
    const { accountDetails, ...memberData } = req.body;
    const member = await Member.create(memberData);
    
    // Nếu có accountDetails, tạo User
    if (accountDetails && accountDetails.username && accountDetails.password) {
      await User.create({
        username: accountDetails.username,
        password: accountDetails.password,
        role: accountDetails.role || 'USER',
        memberId: member.id
      });
    }

    res.json({ success: true, member });
  } catch(err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    await Member.update(req.body, { where: { id: req.params.id } });
    res.json({ success: true });
  } catch(err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// Backend chỉ chịu xóa thẳng 1 Node. (Việc xóa đệ quy Node Con sẽ do Frontend đệ trình Dòng thác mã Delete xuống qua nhiều lời gọi REST API cho thuần khiết) Hoặc có thể viết thêm 1 Cổng xóa Đệ quy Cấp Cuối.
router.delete('/:id', async (req, res) => {
  try {
    await Member.destroy({ where: { id: req.params.id } }); 
    res.json({ success: true });
  } catch(err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

module.exports = router;
