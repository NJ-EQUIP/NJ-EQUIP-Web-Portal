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
        <p className="calc subtitle">Enter a ZIP code (e.g., 07003) or a county (e.g., Essex).</p>

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
                <span className="badge badge-danger">Overburdened</span>
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
                <li>Explore programs like the <strong>Low-Income Home Energy Assistance Program (LIHEAP)</strong> It can help with your energy costs and even pay for home weatherization to reduce future bills.</li>
                <li>Small actions like sealing air leaks around windows and doors or adding insulation can make your home more energy-efficient, HVAC costs down.</li>
                <li>Consider <strong>community solar progams.</strong> This allows you to subscribe to a shared solar energy source without the cost of installing panels. It’s a great way to reduce your electricity bills and your carbon footprint.</li>
                <li>Contact your utility provider about <strong>budget billing plans</strong> or <strong>payment assistance programs</strong>, which can spread out costs and make bills more manageable.</li>
                <li>Programs like the <strong>Weatherization Assistance Program (WAP)</strong> can provide free services to improve your home’s energy efficiency, such as adding insulation or repairing your heating system.</li>
                <li>The <strong>Comfort Partners Program</strong> provides free energy-saving upgrades for eligible households, helping reduce energy use and costs over the long term.</li>
                <li>Replacing older appliances with <strong>ENERGY STAR-certified models</strong> can reduce your energy use, and rebates are offered through the <strong>New Jersey Clean Energy Program</strong> make them more affordable.</li>
              </ul>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
