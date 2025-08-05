import React, { useState, useEffect } from "react"

const Calculator = () => {
    const [result, setResult] = useState(null)
    const [dataset, setDataset] = useState([])

    useEffect(() => {
        // Load static JSON once on mount
        fetch('/data/Energy_Burden_with_ZIP_Codes.json')
            .then(res => res.json())
            .then(data => setDataset(data))
            .catch(err => console.error('Failed to load JSON:', err))
    }, [])

    const normalizeCounty = (str) => {
        return str?.toLowerCase().replace(/\s+county$/, '').trim()
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        const input = e.target.location.value.trim()

        if (!input) {
            setResult({ error: 'Please enter a ZIP code or county name.' })
            return
        }

        const isZip = /^\d{5}$/.test(input)
        const zip = input
        const county = input

        let match = null

        if (isZip) {
            match = dataset.find(row =>
                row['ZIP Codes']?.split(',').map(z => z.trim()).includes(zip)
            )
        } else {
            match = dataset.find(
                row => normalizeCounty(row['County Name']) === normalizeCounty(county)
            )
        }

        if (!match) {
            setResult({ error: 'No data found for that ZIP code or county.' })
            return
        }

        setResult({
            energyBurdenPercent: match['Energy Burden Pct Income'] + '%',
            county: match['County Name'],
            zip: isZip ? zip : '',
            message: isZip
                ? `Energy burden for ZIP ${zip} (in ${match['County Name']} County)`
                : `Energy burden for ${match['County Name']} County`,
            display: `<p>This value represents the average household burden for the selected area.</p>`
        })
    }

    return (
        <div className="energy-form-container">
            <h2>Energy Burden Calculator</h2>
            <form className="energy-form" onSubmit={handleSubmit}>
                <label>
                    Enter ZIP Code or County Name:
                    <input type="text" name="location" placeholder="e.g. 07003 or Essex" />
                </label>
                <button type="submit">Check Energy Burden</button>
            </form>

            {result && (
                <div className="calc-result">
                    {result.error ? (
                        <p style={{ color: 'red' }}>{result.error}</p>
                    ) : (
                        <>
                            <p><strong>Energy Burden:</strong> {result.energyBurdenPercent}</p>
                            <p><strong>Status:</strong> {result.message}</p>
                            {result.display && <div dangerouslySetInnerHTML={{ __html: result.display }} />}
                        </>
                    )}
                </div>
            )}
        </div>
    )
}

export default Calculator
