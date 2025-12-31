export function countyDatasetNeedsYear(dataset) {
  return ['heating-fuel', 'housing-built-year', 'income', 'njcep-savings', 'race-ethnicity', 'tenure-type']
    .includes(dataset);
}

export function municipalDatasetNeedsYear(dataset) {
  // Your muni energy-consumption spans 2016–2023; the others are static (or currently single-year)
  return dataset === 'energy-consumption';
}
