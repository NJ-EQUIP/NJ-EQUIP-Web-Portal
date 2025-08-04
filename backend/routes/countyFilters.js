const express = require('express');
const router = express.Router();

const {
  loadElectricGas,
  loadEnergyBurden,
  loadHeatingFuel,
  loadHousingBuiltYear,
  loadIncome,
  loadNjcepSavings,
  loadRaceEthnicity,
  loadTenureType
} = require('../loaders');

// Route: /api/county-filters/electric-gas
router.get('/electric-gas', async (req, res) => {
  try {
    const data = await loadElectricGas();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load Electric Gas data.' });
  }
});

router.get('/energy-burden', async (req, res) => {
  try {
    const data = await loadEnergyBurden();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load Energy Burden data.' });
  }
});

router.get('/heating-fuel', async (req, res) => {
  try {
    const data = await loadHeatingFuel();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load Heating Fuel data.' });
  }
});

router.get('/housing-built-year', async (req, res) => {
  try {
    const data = await loadHousingBuiltYear();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load Housing Built Year data.' });
  }
});

router.get('/income', async (req, res) => {
  try {
    const data = await loadIncome();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load Income data.' });
  }
});

router.get('/njcep-savings', async (req, res) => {
  try {
    const data = await loadNjcepSavings();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load NJCEP Savings data.' });
  }
});

router.get('/race-ethnicity', async (req, res) => {
  try {
    const data = await loadRaceEthnicity();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load Race/Ethnicity data.' });
  }
});

router.get('/tenure-type', async (req, res) => {
  try {
    const data = await loadTenureType();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load Tenure Type data.' });
  }
});

module.exports = router
