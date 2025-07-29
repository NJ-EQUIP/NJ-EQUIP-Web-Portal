// Add Validation and error checks for form inputs (Zipcode length, negative income, etc.)
// Add Decision Support
import React, { useState } from "react"
import { calculateEnergyBurden } from "../utils/energyCalc"

const Calculator = () => {
    const [result, setResult] = useState(null)

    const stateData = {
        // Link zip code database
        // example: "07003": { Re: 0.13, Rh: 1.1 },
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        const userData = {
            Zc: e.target.zip.value,
            Ee: parseFloat(e.target.electricity.value),
            Eh: parseFloat(e.target.heating.value),
            Mi: parseFloat(e.target.income.value),
        }

        const stateAverageEB = 6; // e.g., 6%
        const result = calculateEnergyBurden(userData, stateData, stateAverageEB)
        setResult(result)
    }
    return (
        <div className="energy-form-container">
            <h2>Energy Burden Calculator</h2>
            <form className="energy-form" onSubmit={handleSubmit}>
                <input name="zip" placeholder="Zip Code" required />
                <input name="electricity" type="number" placeholder="Electricity Usage (kWh)" required />
                <input name="heating" type="number" placeholder="Heating Usage (therms)" required />
                <input name="income" type="number" placeholder="Monthly Income ($)" required />
                <button type="submit">Calculate</button>
            </form>

            {result && (
                <div className="calc-result">
                    <p><strong>Energy Burden:</strong> {result.energyBurdenPercent}</p>
                    <p><strong>Status:</strong> {result.message}</p>
                    {result.display && <p dangerouslySetInnerHTML={{ __html: result.display }} />}
                </div>
            )}
        </div>
    )
}

export default Calculator