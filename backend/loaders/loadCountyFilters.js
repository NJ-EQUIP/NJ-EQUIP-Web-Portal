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
  loadElectricGas: () => loadCSV(path.join(__dirname, '../data/county-filters/Electric_gas_by_county.csv')),
  loadEnergyBurden: () => loadCSV(path.join(__dirname, '../data/county-filters/Energy-Burden-County.csv')),
  loadHeatingFuel: () => loadCSV(path.join(__dirname, '../data/county-filters/heating-fuel.csv')),
  loadHousingBuiltYear: () => loadCSV(path.join(__dirname, '../data/county-filters/housing_built_year.csv')),
  loadIncome: () => loadCSV(path.join(__dirname, '../data/county-filters/income.csv')),
  loadNjcepSavings: () => loadCSV(path.join(__dirname, '../data/county-filters/njcep_with_savings.csv')),
  loadRaceEthnicity: () => loadCSV(path.join(__dirname, '../data/county-filters/race_ethnicity_hispanic_latino.csv')),
  loadTenureType: () => loadCSV(path.join(__dirname, '../data/county-filters/tenure_type.csv'))
}