const express = require('express')
const router = express.Router()

module.exports = (energyBurdenData) => {
  router.get('/all', (req, res) => {
    const allData = Object.values(energyBurdenData)
    res.json(allData)

  })

  // Route: Get by ZIP
  router.get('/:zip', (req, res) => {
    const zip = req.params.zip.padStart(5, '0')
    const record = energyBurdenData[zip]

    if (record) {
      res.json(record)
    } else {
      res.status(404).json({ message: 'No data found for ZIP: ' + zip })
    }
  })
  return router
}