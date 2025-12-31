import React from "react";

function Resources() {
    return (
        <div className="faq-container">
            <h2>Resources</h2>

            {/* Energy Assistance Programs */}
            <details className="faq-item">
                <summary><h3>Energy Assistance Programs (For NJ Residents)</h3></summary>
                <ul className="link-list">
                    <li>
                        <strong>LIHEAP – Low-Income Home Energy Assistance Program:</strong>{" "}
                        <a href="https://www.nj.gov/dca/divisions/dhcr/offices/hea.html">
                            nj.gov/dca/divisions/dhcr/offices/hea.html
                        </a>{" "}
                        <br></br>
                        — Provides financial help with heating and cooling bills for eligible households.

                    </li>
                    <li>
                        <strong>Universal Service Fund (USF) – NJ Board of Public Utilities:</strong>{" "}
                        <a href="https://www.njcleanenergy.com/residential/programs/usf">
                            njcleanenergy.com/residential/programs/usf
                        </a>{" "}
                        <br></br>
                        — Helps low-income households reduce the cost of their gas and electric bills.
                    </li>
                    <li>
                        <strong>NJ SHARES:</strong>{" "}
                        <a href="https://www.njshares.org/">njshares.org</a>{" "}
                        <br></br>
                        — Provides energy assistance to households in temporary financial crisis.
                    </li>
                    <li>
                        <strong>Weatherization Assistance Program (WAP):</strong>{" "}
                        <a href="https://www.nj.gov/dca/divisions/dhcr/offices/wap.html">
                            nj.gov/dca/divisions/dhcr/offices/wap.html
                        </a>{" "}
                        <br></br>
                        — Offers home energy efficiency upgrades at no cost to eligible households.
                    </li>
                </ul>
            </details>

            {/* Clean Energy Incentives */}
            <details className="faq-item">
                <summary><h3>Clean Energy Incentives</h3></summary>
                <ul className="link-list">
                    <li>
                        <strong>New Jersey Clean Energy Program (NJCEP):</strong>{" "}
                        <a href="https://www.njcleanenergy.com/">njcleanenergy.com</a>{" "}
                        <br></br>
                        — Rebates and incentives for energy-efficient appliances, solar energy, and more.
                    </li>
                    <li>
                        <strong>Community Solar Program – NJ BPU:</strong>{" "}
                        <a href="https://njcleanenergy.com/CS">njcleanenergy.com/CS</a>{" "}
                        <br></br>
                        — Benefit from solar without installing panels at home.
                    </li>
                    <li>
                        <strong>Energy Efficiency Rebates for Renters:</strong>{" "}
                        <a href="https://www.njcleanenergy.com/residential/programs/quick-home-energy-checkup">
                            Quick Home Energy Checkup
                        </a>
                    </li>
                </ul>
            </details>

            {/* Environmental Justice */}
            <details className="faq-item">
                <summary><h3>Environmental Justice & Overburdened Communities</h3></summary>
                <ul className="link-list">
                    <li>
                        <a href="https://www.nj.gov/dep/ej/communities.html">
                            NJDEP Overburdened Communities Map
                        </a>
                    </li>
                    <li>
                        <a href="https://dep.nj.gov/ej/">New Jersey Office of Environmental Justice</a>
                    </li>
                    <li>
                        <a href="https://www.epa.gov/ejscreen">EPA EJScreen</a>
                    </li>
                </ul>
            </details>

            {/* Data & Mapping */}
            <details className="faq-item">
                <summary><h3>Data &amp; Mapping Tools</h3></summary>
                <ul className="link-list">
                    <li>
                        <a href="https://www.energy.gov/eere/slsc/maps/lead-tool">DOE LEAD Tool</a>
                    </li>
                    <li>
                        <a href="https://njgin.nj.gov/">NJGIN – NJ Geographic Information Network</a>
                    </li>
                    <li>
                        <a href="https://data.census.gov/">US Census Bureau – American Community Survey</a>
                    </li>
                    <li>
                        <a href="https://www.njcleanenergy.com/comprehensive-data">
                            NJ BPU Clean Energy Data
                        </a>
                    </li>
                </ul>
            </details>

            {/* Educational */}
            <details className="faq-item">
                <summary><h3>Educational Resources</h3></summary>
                <ul className="link-list">
                    <li>
                        <a href="https://www.aceee.org/energy-burden">What Is Energy Burden? (ACEEE)</a>
                    </li>
                    <li>
                        <a href="https://nj.gov/emp/">New Jersey Energy Master Plan (2021)</a>
                    </li>
                    <li>
                        <a href="https://www.sustainablejersey.com">Sustainable Jersey Energy Tools</a>
                    </li>
                </ul>
            </details>

            {/* FAQ section */}
            <br></br>

            <h2>Frequently Asked Questions</h2>

            <details className="faq-item">
                <summary><h3>What is energy burden?</h3></summary>
                <ul className="link-list">
                    <li>
                        Energy burden refers to the percentage of a household's income spent on home energy
                        bills—such as electricity, heating, and cooling. A household is generally considered
                        overburdened if it spends more than 6% of its income on energy costs.
                    </li>
                </ul>
            </details>

            <details className="faq-item">
                <summary><h3>What is energy equity and why does it matter?</h3></summary>
                <ul className="link-list">
                    <li>
                        Energy equity means ensuring all people—regardless of income, race, or housing status—have
                        access to affordable, reliable, and clean energy. High energy burdens can deepen inequality,
                        strain family budgets, and limit access to basic needs like heating or cooling.
                    </li>
                </ul>
            </details>

            <details className="faq-item">
                <summary><h3>Who is most affected by high energy burdens in New Jersey?</h3></summary>
                <ul className="link-list">
                    <li>
                        Low-income households, renters, people of color, and those in older or poorly insulated
                        housing are disproportionately affected. Overburdened communities may rely on expensive or
                        inefficient fuels and have less access to clean-energy incentives.
                    </li>
                </ul>
            </details>

            <details className="faq-item">
                <summary><h3>How do I calculate my energy burden using this tool?</h3></summary>
                <ul className="link-list">
                    <li>
                        Go to “Calculate Energy Burden” and enter your annual household income, primary heating
                        fuel, and ZIP code or county. The tool calculates your energy burden and shows how it
                        compares to state and local averages.
                    </li>
                </ul>
            </details>

            <details className="faq-item">
                <summary><h3>What geographic areas does this tool cover?</h3></summary>
                <ul className="link-list">
                    <li>
                        NJ EQUIP provides data at the municipality, county, and ZIP code levels across New Jersey.
                        You can explore and compare energy-burden trends by geography and time.
                    </li>
                </ul>
            </details>

            <details className="faq-item">
                <summary><h3>Where does the data come from?</h3></summary>
                <ul className="link-list">
                <li>
                    Sources include the U.S. Census Bureau (ACS &amp; Decennial Census), NJ Clean Energy
                    Program (NJCEP), New Jersey Board of Public Utilities (NJBPU), publicly available Reddit
                    posts (for sentiment analysis), and NJGIN for mapping boundaries.
                </li>
                </ul>
            </details>

            <details className="faq-item">
                <summary><h3>What is an overburdened community?</h3></summary>
                <ul className="link-list">
                <li>
                    As defined by NJDEP, an overburdened community meets criteria based on income, race/ethnicity,
                    and English proficiency. These communities often face greater environmental and health risks
                    and are prioritized under New Jersey’s environmental justice policies.
                </li>
                </ul>
            </details>

            <details className="faq-item">
                <summary><h3>How does NJ EQUIP measure public opinion on energy policy?</h3></summary>
                <ul className="link-list">
                <li>
                    We apply sentiment analysis (e.g., VADER, ClimateBERT) to Reddit comments to identify
                    positive, neutral, or negative sentiment over time, helping visualize reactions to policies
                    like rebates or clean-energy programs.
                </li>
                </ul>
            </details>

            <details className="faq-item">
                <summary><h3>Can I download or export the data?</h3></summary>
                <ul className="link-list">
                <li>
                    Visualizations are available for public use. Export/download features may be added in future
                    versions to support research and community advocacy.
                </li>
                </ul>
            </details>

            <details className="faq-item">
                <summary><h3>Who should use NJ EQUIP?</h3></summary>
                <ul className="link-list">
                <li>
                    Residents seeking to understand energy costs; community organizations advocating for energy
                    justice; researchers studying demographic/spatial patterns; and policymakers/planners working
                    on equitable clean-energy programs.
                </li>
                </ul>
            </details>
        </div>

    );
}

export default Resources;
