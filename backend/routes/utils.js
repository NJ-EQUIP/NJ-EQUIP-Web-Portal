// Reduce Code for repetative querying
// County and Year querying: housing-built-year; heating-fuel; njcep-savings; tenure-type; race-ethnicity

export function filterQuery(userData, stateData) {
    const { year, county } = req.query;

    const normalizeCounty = (str) =>
        str?.toLowerCase().replace(/\s+county$/, '').trim()

    const filtered = data.filter(row => {
        const rowCounty = row.county || row.County || row.COUNTY
        const rowYear = row.year || row.Year || row.Year

        const matchesCounty = !county || normalizeCounty(rowCounty) === normalizeCounty(county)

        const matchesYear = !year || rowYear?.toString() === year

        return matchesCounty && matchesYear
    })

    res.json(filtered)
}