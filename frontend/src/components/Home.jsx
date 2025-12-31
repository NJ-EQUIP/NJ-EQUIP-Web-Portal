import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'

function Home() {
    return (
        <div className="home wrapper">
            <div className="box-container">
                <div className="box left-box">
                    <div>
                        <img src="logo3.png" alt="NJ-Equip" className="home-logo" />
                        <p>
                            <b>Energy equity</b> means ensuring that all communities—regardless of income, race, or housing status—have fair access to affordable, reliable, and clean energy. In New Jersey, energy burden remains disproportionately high in many low-income and overburdened communities.
                        </p>
                        <br></br>

                        <ul>
                            <li><b>Energy burden</b>  refers to the percentage of a household's income spent on home energy bills—such as electricity, heating, and cooling
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="right-column">
                    <div className="box">
                        <div className="right-top">
                            <div className="card-left">
                                <h3>Calculate Your Energy Burden</h3>
                                <br></br>
                                <Link to="/calculator">
                                    <img src="calc.png" alt="Energy Burden Calculator" />
                                </Link>
                            </div>
                            <div className="card-right">
                                

                                <p><b>Curious if your household is energy-burdened?</b></p>
                                <br></br>
                                <p>Estimate your household energy burden using ZIP or county and compare against averages.</p>
                                <br></br>
                                <p>Our built-in calculator uses your area’s average income, electric consumption and heating fuel to calculate your burden.</p>
                            </div>
                        </div>
                    </div>

                    <div className="box">
                        <div className="right-bottom">
                            <div className="card-left">
                                <h3>Visualize Energy Patterns Across New Jersey</h3>
                                <br></br>
                                <p>Explore municipal and county-level trends in energy burden, housing, income, and overburdened community status using interactive maps, filters, and timelines. </p>
                            </div>
                            <div className="card-right">
                                <Link to="/map">
                                    <img src="map.png" alt="New Jersey County Map" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default Home