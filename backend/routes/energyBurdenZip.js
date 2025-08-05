const express = require('express')
const router = express.Router()

const {
  loadEnergyBurdenZip
} = require('../loaders')

//Move to shared util
function normalizeCounty(str) {
  return str?.toLowerCase().replace(/\s+county$/, '').trim()
}

router.get('/', async (req, res) => {
  try {
    const data = await loadEnergyBurdenZip()
    const { zip, county } = req.query

    if (!zip && !county) {
      return res.json(data); // Return all if no filter provided
    }

    let match;

    if (zip) {
      match = data.find(row =>
        row['ZIP Codes']?.split(',').map(z => z.trim()).includes(zip)
      );
    }

    if (!match && county) {
      match = data.find(row =>
        normalizeCounty(row['County Name']) === normalizeCounty(county)
      );
    }

    if (!match) {
      return res.status(404).json({ error: 'No match found for ZIP or County.' });
    }

    res.json(match);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to load Energy Burden data.' });
  }
})

module.exports = router