import React, { useEffect, useMemo, useState } from "react";

export default function Calculator() {
  const [dataset, setDataset] = useState([]);
  const [query, setQuery] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/data/Energy_Burden_with_ZIP_Codes.json")
      .then((r) => r.json())
      .then(setDataset)
      .catch((e) => console.error("Failed to load JSON:", e));
  }, []);

  const normalizeCounty = (str) =>
    str?.toLowerCase().replace(/\s+county$/, "").trim();

  const findRow = (value) => {
    const isZip = /^\d{5}$/.test(value);
    if (isZip) {
      return dataset.find((row) =>
        row["ZIP Codes"]?.split(",").map((z) => z.trim()).includes(value)
      );
    }
    return dataset.find(
      (row) => normalizeCounty(row["County Name"]) === normalizeCounty(value)
    );
  };

  const onSubmit = (e) => {
    e.preventDefault();
    setError("");
    setResult(null);

    const v = (query || "").trim();
    if (!v) {
      setError("Please enter a ZIP code or county name.");
      return;
    }
    const row = findRow(v);
    if (!row) {
      setError("No data found for that ZIP code or county.");
      return;
    }

    const burden = Number(row["Energy Burden Pct Income"]);
    const county = row["County Name"];
    const isZip = /^\d{5}$/.test(v);

    setResult({
      county,
      burden,
      overburdened: burden > 2.11,
      isZip,
      zip: isZip ? v : "",
      // add other fields from your dataset here as needed
    });
  };

  const stateAverageNote = useMemo(
    () => "New Jersey state average is ~2.11%.",
    []
  );

  return (
    <div className="calc container">
      <div className="calc form-box">
        <h1>Energy Burden Calculator</h1>
        <p className="calc subtitle">Use our calculator to estimate how much of your income goes toward energy bills. A central measure of energy equity is Energy Burden, which refers to the percentage of a household’s income spent on energy bills. By just entering your zip-code or county name, you'll receive an instant energy burden estimate and learn how it compares to the rest of New Jersey.</p>
        <p><b>Median NJ energy burden - 2% and Average NJ energy burden is 2.11%
        </b></p>

        <form className="calc form" onSubmit={onSubmit}>
          <input
            className="calc input"
            type="text"
            placeholder="ZIP or County"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button className="calc button" type="submit">Calculate</button>
        </form>

        {error && <div className="calc error">{error}</div>}
      </div>
      {result && (
        <section className="calc card">
          <h2 className="calc card-title">
            {result.isZip
              ? `Results for ${result.zip} (${result.county} County)`
              : `Results for ${result.county} County`}
          </h2>

          <div className="calc stats">
            <p><span className="calc label">Energy Burden:</span> {Number.isFinite(result.burden) ? `${result.burden}%` : "N/A"}</p>
            <p>
              <span className="calc label">Status:</span>{" "}
              {result.overburdened ? (
                <span className="badge badge-danger">Relatively Burdened</span>
              ) : (
                <span className="badge badge-success">Below State Average</span>
              )}
            </p>
            <p className="calc note">{stateAverageNote}</p>
          </div>

          {/* Extra fields from old code can slot in here */}
          {/* <p><span className="calc label">Median Income:</span> {result.medianIncome}</p> */}
          {/* <p><span className="calc label">Dominant Heating Fuel:</span> {result.heatingFuel}</p> */}

          {result.overburdened && (
            <div className="tips">
              <h3 className="tips title">Tips to Lower Energy Burden</h3>
              <ul className="tips list">
                <h4>1. You May Qualify for Energy Assistance Programs</h4>
                <p>If your energy burden is high, you may be eligible for programs that offer bill payment assistance, energy credits, or discounted utility rates: LIHEAP – Helps with heating and cooling costs, USF (Universal Service Fund) – Reduces electric and gas bills, PAGE Program – Payment Assistance for Gas and Electric (for moderate-income households).</p>
                <p>Check eligibility and apply through the                 <a href="https://njdca-housing.dynamics365portals.us/en-US/">NJ DCAid Screening Tool </a></p>
                <br></br>
                <br></br>
                <h4>2. Improve Home Energy Efficiency at No Cost</h4>
                <p>If your home is older or you rent, you may be paying more due to inefficiency. Programs like:
                  <li>Weatherization Assistance Program (WAP) – Free upgrades like insulation, air sealing, and appliance tune-ups.</li>
                  <li>Quick Home Energy Check-Up (QHEC) – For renters or homeowners.</li>
                </p>
                <p>Learn more and apply through <a href="https://www.njcleanenergy.com/residential/programs/home-performance-energy-star/low-moderate-income-programs">NJ Clean Energy & Weatherization Programs</a></p>
                <br></br>
                <br></br>
                <h4>3. Explore Community Solar Options</h4>
                <p>If rooftop solar isn't an option, community solar allows renters and low-income households to subscribe to clean energy and save on bills.
                  <li>Save up to 10–25% on electricity with no upfront cost</li>
                  <li> <a href="https://njcleanenergy.com/renewable-energy/programs/community-solar">https://njcleanenergy.com/renewable-energy/programs/community-solar</a></li>
                </p>
                <br></br>
                <h4>4. Switch to Lower-Cost Fuel Types (if applicable)</h4>
                <p>If the user selected oil or propane, recommend exploring:
                  <li>Utility conversion incentives (e.g., switching to electric heat pumps or gas)</li>
                  <li>Programs that subsidize transitions to efficient electric appliances</li>
                  <a href="https://www.njcleanenergy.com/residential/programs/comfort-partners">Explore NJ Clean Energy Appliance & Electrification Incentives</a>
                </p>
                <br></br>
                <h4>5. Check If You Live in an Overburdened Community</h4>
                <p>If the user's ZIP or county overlaps with NJDEP’s Overburdened Communities, they may have access to:
                  <li>Prioritized program enrollment</li>
                  <li>Targeted outreach or funding</li>
                  <li>Energy equity pilot programs</li>
                </p>
                <p>Check your community status with <a href="https://www.njcleanenergy.com/residential/programs/comfort-partners">NJDEP Overburdened Communities Map</a></p>
                <br></br>
              </ul>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
