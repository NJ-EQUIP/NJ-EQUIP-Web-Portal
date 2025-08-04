const express = require('express')
const cors = require('cors')

//const energyBurdenRoute = require('./routes/energyBurden')
const countyFilterRoute = require('./routes/countyFilters')
require('dotenv').config()

const app = express()
const PORT = 5050

app.use(cors())
app.use(express.json())

app.use('/api/county-filters', countyFilterRoute)

app.get('/', (req, res) => {
  res.send('API is running.')
})

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`)
})