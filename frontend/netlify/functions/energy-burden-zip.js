const { loadEnergyBurdenZip } = require('../../../backend/loaders/loadEnergyBurdenZip')

function normalizeCounty(str) {
  return str?.toLowerCase().replace(/\s+county$/, '').trim()
}

exports.handler = async function (event, context) {
  try {
    const data = await loadEnergyBurdenZip()
    const { zip, county } = event.queryStringParameters || {}

    if (!zip && !county) {
      return {
        statusCode: 200,
        body: JSON.stringify(data),
      }
    }

    let match

    if (zip) {
      match = data.find((row) =>
        row['ZIP Codes']?.split(',').map((z) => z.trim()).includes(zip)
      )
    }

    if (!match && county) {
      match = data.find(
        (row) => normalizeCounty(row['County Name']) === normalizeCounty(county)
      )
    }

    if (!match) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'No match found for ZIP or County.' }),
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify(match),
    }
  } catch (err) {
    console.error(err)
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to load Energy Burden data.' }),
    }
  }
}
