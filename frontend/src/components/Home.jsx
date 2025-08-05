import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'

function Home() {
    return (
        <div className="wrapper">
            <div className="box-container">
                <div className="box left-box">
                    <div>
                        <h2>New Jersey Energy eQuity User Interactive Portal</h2>
                        <p><b>Energy equity</b> means ensuring that all communities—regardless of income, race, or housing status—have fair access to affordable, reliable, and clean energy. In New Jersey, energy burden remains disproportionately high in many low-income and overburdened communities.</p>
                        <br></br>
                        <ul><b>NJ EQUIP</b> is the first interactive, data-driven platform built specifically for New Jersey that brings together:</ul>
                        <li>Spatiotemporal energy burden analysis</li>
                        <li>Socio-demographic equity indicators</li>
                        <li>Public sentiment around energy policy</li>
                        <li>Real-time, map-based visualization tool</li>

                    </div>
                </div>
                <div className="box right-box">
                    <Link to="/map">Map
                        <img src="https://ik.imagekit.io/clouglobal/img/wp-content/uploads/2023/08/Net-zero-buildings-are-revolutionary-structures-designed-to-achieve-a-state-of-carbon-neutrality-where-the-energy-consumed-is-offset-by-renewable-energy-generation-symbol-image-credit-CLOU-1.jpg" alt="New Jersey County Map" /></Link>
                    <Link to="/calculator">Energy-Calculator
                    <div><h2>**Add img for link here</h2></div>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default Home