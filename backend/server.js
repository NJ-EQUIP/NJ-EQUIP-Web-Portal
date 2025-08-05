const express = require('express')
const cors = require('cors')

const countyFilterRoute = require('./routes/countyFilters')
const muniFilterRoute = require('./routes/muniFilters')
const zipFilterRoute = require('./routes/energyBurdenZip')

require('dotenv').config()

const app = express()
const PORT = 5050

app.use(cors())
app.use(express.json())

app.use('/api/county-filters', countyFilterRoute)
app.use('/api/muni-filters', muniFilterRoute)
app.use('/api/zip-filters', zipFilterRoute)

app.get('/', (req, res) => {
  res.send('API is running.')
})

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`)
})