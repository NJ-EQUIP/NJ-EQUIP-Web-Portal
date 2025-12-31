export const datasetFileMap = {
  'energy-burden': 'Energy-Burden-County.json',
  'housing-built-year': 'housing_built_year.json',
  'heating-fuel': 'heating-fuel.json',
  'income': 'income.json',
  'njcep-savings': 'njcep_with_savings.json',
  'race-ethnicity': 'race_ethnicity_hispanic_latino.json',
  'tenure-type': 'tenure_type.json',
};

export const municipalDatasetFileMap = {
  'energy-burden': 'energy_burden_output_NEW.json',
  'energy-consumption': 'Utility_Consumptio.json',
  'ghg-emissions': 'Community-Scale_GHG_Emissions_07.25.24.json',
};

export const MUNI_YEARS = Array.from({ length: 2023 - 2016 + 1 }, (_, i) => (2016 + i).toString());
export const municipalURL = 'https://services2.arcgis.com/XVOqAjTOJ5P6ngMu/arcgis/rest/services/NJ_Municipal_Boundaries_3424/FeatureServer/0/query?outFields=*&where=1%3D1&f=geojson';
export const countyURL     = 'https://services2.arcgis.com/XVOqAjTOJ5P6ngMu/arcgis/rest/services/NJ_Counties_3424/FeatureServer/0/query?outFields=*&where=1%3D1&f=geojson';