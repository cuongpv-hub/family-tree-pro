const express = require('express');
const router = express.Router();
const { sendTestReport } = require('../services/emailService');

/**
 * POST /api/test-report
 * @Tester gọi endpoint này để gửi báo cáo qua email
 */
router.post('/send', async (req, res) => {
  try {
    const { testResults, toEmail } = req.body;

    const totalPass = testResults.filter(t => t.status === 'pass').length;
    const totalFail = testResults.filter(t => t.status === 'fail').length;
    const totalBug  = testResults.filter(t => t.status === 'bug').length;

    await sendTestReport({
      toEmail: toEmail || 'phamcuong219@gmail.com',
      testResults,
      totalPass,
      totalFail,
      totalBug,
    });

    res.json({ success: true, message: `Đã gửi test report đến ${toEmail}` });
  } catch (error) {
    console.error('[EMAIL ERROR]', error.message);
    // Nếu chưa cấu hình email, trả về report dạng JSON cho console
    res.status(500).json({
      success: false,
      message: 'Chưa cấu hình Gmail App Password. Xem file .env.example',
      error: error.message
    });
  }
});

module.exports = router;
