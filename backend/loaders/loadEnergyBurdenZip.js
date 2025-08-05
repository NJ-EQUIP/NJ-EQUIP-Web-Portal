const fs = require('fs')
const path = require('path')
const csv = require('csv-parser')

function loadCSV(filePath) {
  const dataset = []
  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', (row) => dataset.push(row))
    .on('end', () => resolve(dataset))
    .on('error', (err) => reject(err))
  })
}

module.exports = { 
  loadEnergyBurdenZip: () => loadCSV(path.join(__dirname, '../data/Energy_Burden_with_ZIP_Codes.csv')) 
}