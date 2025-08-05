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
    loadGHG: () => loadCSV(path.join(__dirname, '../data/muni-filters/Community-Scale_GHG_Emissions_07.25.24.csv')),
    loadElectricGas: () => loadCSV(path.join(__dirname, '../data/muni-filters/Electric_gas.csv')),
    loadEnergyBurdenMuni: () => loadCSV(path.join(__dirname, '../data/muni-filters/energy_burden_output_NEW.csv')),
    loadUtilityConsumption: () => loadCSV(path.join(__dirname, '../data/muni-filters/Utility_Consumptio.csv'))
}