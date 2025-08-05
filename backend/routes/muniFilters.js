const express = require('express')
const router = express.Router()

const {
  loadElectricGas,
  loadGHG,
  loadEnergyBurdenMuni,
  loadUtilityConsumption
} = require('../loaders');

router.get('/electric-gas', async (req, res) => {
  try {
    const data = await loadElectricGas();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load Electric Gas data.' });
  }
});

router.get('/ghg', async (req, res) => {
  try {
    const data = await loadGHG();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load GHG data.' });
  }
});

router.get('/EnergyBurdenMuni', async (req, res) => {
  try {
    const data = await loadEnergyBurdenMuni();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load Energy Burden data.' });
  }
});

router.get('/UtilityConsumption', async (req, res) => {
  try {
    const data = await loadUtilityConsumption();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load Utitlity consumption data.' });
  }
});

module.exports = router
