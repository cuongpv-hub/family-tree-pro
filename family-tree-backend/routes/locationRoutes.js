const express = require('express');
const router = express.Router();
const Province = require('../models/Province');
const District = require('../models/District');
const Ward = require('../models/Ward');

// GET /api/locations/provinces
router.get('/provinces', async (req, res) => {
  try {
    const provinces = await Province.findAll();
    res.json(provinces);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/locations/districts?provinceCode=X
router.get('/districts', async (req, res) => {
  try {
    const { provinceCode } = req.query;
    if (!provinceCode) {
      return res.status(400).json({ error: 'Missing provinceCode parameter' });
    }
    const districts = await District.findAll({ where: { provinceCode } });
    res.json(districts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/locations/wards?districtCode=X
router.get('/wards', async (req, res) => {
  try {
    const { districtCode } = req.query;
    if (!districtCode) {
      return res.status(400).json({ error: 'Missing districtCode parameter' });
    }
    const wards = await Ward.findAll({ where: { districtCode } });
    res.json(wards);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
