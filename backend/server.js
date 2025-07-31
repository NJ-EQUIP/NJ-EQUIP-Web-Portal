const express = require('express')
const cors = require('cors')
const loadEnergyBurdenCSV = require('./loaders/loadEnergyBurden')
const energyBurdenRoute = require('./routes/energyBurden')
require('dotenv').config()

const app = express()
const PORT = 5050

app.use(cors())

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`)
  next()
})

app.get('/', (req, res) => {
  res.send('API is running. Try /api/energy-burden/07003')
})

async function startServer() {
  const energyBurdenData = await loadEnergyBurdenCSV('./data/Energy_Burden_with_ZIP_Codes.csv')

  app.use('/api/energy-burden', energyBurdenRoute(energyBurdenData))

  app.listen(PORT, () => {
    console.log(`Backend running at http://localhost:${PORT}`)
  })
}

startServer()