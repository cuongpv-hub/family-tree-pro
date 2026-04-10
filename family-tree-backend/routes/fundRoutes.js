const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const FundTransaction = require('../models/FundTransaction');

// Setup multer để lưu ảnh biên lai vào thư mục uploads/receipts/
const receiptDir = path.join(__dirname, '../uploads/receipts');
if (!fs.existsSync(receiptDir)) fs.mkdirSync(receiptDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, receiptDir),
  filename: (req, file, cb) => cb(null, `receipt_${Date.now()}${path.extname(file.originalname)}`)
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

// GET: Thống kê dòng tiền + tóm tắt theo tháng
router.get('/', async (req, res) => {
  try {
    const transactions = await FundTransaction.findAll({
      order: [['transactionDate', 'DESC'], ['createdAt', 'DESC']]
    });

    // Tính tổng số dư
    let totalFund = 0;
    transactions.forEach(tx => {
      if (tx.type === 'IN') totalFund += tx.amount;
      else totalFund -= tx.amount;
    });

    // Tóm tắt theo tháng (6 tháng gần nhất)
    const monthlySummary = {};
    transactions.forEach(tx => {
      const month = tx.transactionDate ? tx.transactionDate.substring(0, 7) : 'N/A';
      if (!monthlySummary[month]) monthlySummary[month] = { month, totalIn: 0, totalOut: 0 };
      if (tx.type === 'IN') monthlySummary[month].totalIn += tx.amount;
      else monthlySummary[month].totalOut += tx.amount;
    });

    const monthlyChart = Object.values(monthlySummary)
      .sort((a, b) => a.month.localeCompare(b.month))
      .slice(-6);

    // Tóm tắt theo danh mục
    const categorySummary = {};
    transactions.forEach(tx => {
      const cat = tx.category || 'Khác';
      if (!categorySummary[cat]) categorySummary[cat] = { category: cat, total: 0, count: 0 };
      categorySummary[cat].total += tx.amount;
      categorySummary[cat].count++;
    });

    res.json({ success: true, totalFund, transactions, monthlyChart, categorySummary: Object.values(categorySummary) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Lỗi khi tải dòng tiền' });
  }
});

// POST: Lập phiếu mới (có hỗ trợ ảnh biên lai)
router.post('/', upload.single('receiptImage'), async (req, res) => {
  try {
    const { type, amount, description, transactionDate, recorderName, category } = req.body;
    const receiptImage = req.file ? `/uploads/receipts/${req.file.filename}` : null;

    const newTx = await FundTransaction.create({
      type, amount: parseInt(amount), description,
      transactionDate, recorderName, category, receiptImage
    });
    res.json({ success: true, transaction: newTx });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Lỗi lập phiếu thu chi' });
  }
});

// DELETE: Hủy biên lai
router.delete('/:id', async (req, res) => {
  try {
    const tx = await FundTransaction.findByPk(req.params.id);
    if (tx && tx.receiptImage) {
      const filePath = path.join(__dirname, '..', tx.receiptImage);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }
    await FundTransaction.destroy({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (error) {
    console.error('[DELETE /funds] Lỗi hủy biên lai:', error);
    res.status(500).json({ success: false, message: 'Lỗi hủy biên lai' });
  }
});

module.exports = router;
