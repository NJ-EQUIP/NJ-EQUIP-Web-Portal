const fs = require('fs')
const csv = require('csv-parser')

function loadEnergyBurdenCSV(filePath) {
  const data = []

  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', row => {
        data.push(row)
      })
      .on('end', () => {
        console.log('Loaded', data.length, 'records')
        resolve(data)
      })
      .on('error', err => reject(err))
  })
}

module.exports = loadEnergyBurdenCSV 