const express = require('express')
const router = express.Router()
//import { filterQuery } from "/utils.js"
// Reduce repetative querying
// Route: /api/county-filters/*insert-data-link*

const {
  loadEnergyBurden,
  loadHeatingFuel,
  loadHousingBuiltYear,
  loadIncome,
  loadNjcepSavings,
  loadRaceEthnicity,
  loadTenureType
} = require('../loaders');


router.get('/energy-burden', async (req, res) => {
  try {
    const data = await loadEnergyBurden();
    const { name, county } = req.query;
    const targetName = name || county

    const normalizeCounty = (str) =>
      str?.toLowerCase().replace(/\s+county$/, '').trim()

    const filtered = data.filter(row => {
      const rowName = row.name || row.Name || row.NAME

      const matchesName = !targetName || normalizeCounty(rowName) === normalizeCounty(targetName)

      return matchesName
    })
    res.json(filtered);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load Energy Burden data.' });
  }
});

router.get('/heating-fuel', async (req, res) => {
  try {
    const data = await loadHeatingFuel();
    const { year, county } = req.query;

    const normalizeCounty = (str) =>
      str?.toLowerCase().replace(/\s+county$/, '').trim()

    const filtered = data.filter(row => {
      const rowCounty = row.county || row.County || row.COUNTY
      const rowYear = row.year || row.Year || row.Year

      const matchesCounty = !county || normalizeCounty(rowCounty) === normalizeCounty(county)

      const matchesYear = !year || rowYear?.toString() === year

      return matchesCounty && matchesYear
    })

    res.json(filtered);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load Heating Fuel data.' });
  }
});

router.get('/housing-built-year', async (req, res) => {
  try {
    const data = await loadHousingBuiltYear();
    const { year, county } = req.query;

    const normalizeCounty = (str) =>
      str?.toLowerCase().replace(/\s+county   $/, '').trim()

    const filtered = data.filter(row => {
      const rowCounty = row.county || row.County || row.COUNTY
      const rowYear = row.year || row.Year || row.Year

      const matchesCounty = !county || normalizeCounty(rowCounty) === normalizeCounty(county)

      const matchesYear = !year || rowYear?.toString() === year

      return matchesCounty && matchesYear
    })

    res.json(filtered);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load Housing Built Year data.' });
  }
});

router.get('/income', async (req, res) => {
  try {
    const data = await loadIncome();
    const { year, county } = req.query;

    const normalizeCounty = (str) =>
      str?.toLowerCase().replace(/\s+county$/, '').trim()

    const filtered = data.filter(row => {
      const rowCounty = row.county || row.County || row.COUNTY
      const rowYear = row.year || row.Year || row.Year

      const matchesCounty = !county || normalizeCounty(rowCounty) === normalizeCounty(county)

      const matchesYear = !year || rowYear?.toString() === year

      return matchesCounty && matchesYear
    })

    res.json(filtered);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load Income data.' });
  }
});

router.get('/njcep-savings', async (req, res) => {
  try {
    const data = await loadNjcepSavings();
    const { year, county } = req.query;

    const filtered = data.filter(row => {
      const rowCounty = row.county || row.County || row.COUNTY
      const rowYear = row.year || row.Year || row.Year

      const matchesCounty = !county || rowCounty?.toLowerCase() === county.toLowerCase()
      const matchesYear = !year || rowYear?.toString() === year

      return matchesCounty && matchesYear
    })

    res.json(filtered);

  } catch (err) {
    res.status(500).json({ error: 'Failed to load NJCEP Savings data.' });
  }
});

router.get('/race-ethnicity', async (req, res) => {
  try {
    const data = await loadRaceEthnicity();
    const { year, county } = req.query;

    const normalizeCounty = (str) =>
      str?.toLowerCase().replace(/\s+county$/, '').trim()

    const filtered = data.filter(row => {
      const rowCounty = row.county || row.County || row.COUNTY
      const rowYear = row.year || row.Year || row.Year

      const matchesCounty = !county || normalizeCounty(rowCounty) === normalizeCounty(county)

      const matchesYear = !year || rowYear?.toString() === year

      return matchesCounty && matchesYear
    })

    res.json(filtered);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load Race/Ethnicity data.' });
  }
});

router.get('/tenure-type', async (req, res) => {
  try {
    const data = await loadTenureType();
    const { year, county } = req.query;

    const normalizeCounty = (str) =>
      str?.toLowerCase().replace(/\s+county$/, '').trim()

    const filtered = data.filter(row => {
      const rowCounty = row.county || row.County || row.COUNTY
      const rowYear = row.year || row.Year || row.Year

      const matchesCounty = !county || normalizeCounty(rowCounty) === normalizeCounty(county)

      const matchesYear = !year || rowYear?.toString() === year

      return matchesCounty && matchesYear
    })

    res.json(filtered);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load Tenure Type data.' });
  }
});

module.exports = router
