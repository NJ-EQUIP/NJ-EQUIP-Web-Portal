import React, { useState } from "react"
import { calculateEnergyBurden } from "../utils/energyCalc"

// Add result comparison to NJ average to show if overburdend or not
const Calculator = () => {
    const [result, setResult] = useState(null)

    const handleSubmit = async (e) => {
        e.preventDefault()
        const input = e.target.location.value.trim()

        if (!input) {
            setResult({ error: 'Please enter a ZIP code or county name.' })
            return
        }

        const isZip = /^\d{5}$/.test(input)
        const queryParam = isZip ? `zip=${input}` : `county=${encodeURIComponent(input)}`

        try {
           const res = await fetch(`http://localhost:5050/api/zip-filters?${queryParam}`)

            const data = await res.json()

            if (!res.ok) {
                setResult({ error: data.error || 'No data found' })
                return
            }

            setResult({
                energyBurdenPercent: data['Energy Burden Pct Income'] + '%',
                county: data['County Name'],
                zip: isZip ? input : '',
                message: isZip
                    ? `Energy burden for ZIP ${input} (in ${data['County Name']} County)`
                    : `Energy burden for ${data['County Name']} County`,
                display: `<p>This value represents the average household burden for the selected area.</p>`
            })
        } catch (err) {
            console.error(err)
            setResult({ error: 'Failed to fetch data' })
        }
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