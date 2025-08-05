const loadCountyFilters = require('./loadCountyFilters');
const loadMuniFilters = require('./loadMuniFilters');
const loadEnergyBurdenZip = require('./loadEnergyBurdenZip');

// Export all loaders so they can be used in routes
module.exports = {
  ...loadCountyFilters,
  ...loadMuniFilters,
  ...loadEnergyBurdenZip
};
