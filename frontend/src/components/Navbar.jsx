import React from 'react'
import { Link } from 'react-router-dom'

function Navbar() {
    return (
        <header>
            <div className='navbar'>
                <h1>NJ-EQUIP</h1>
                <nav>
                    <ul>
                        <Link to="/">Home</Link>
                        <Link to="/map">Map</Link>
                        <Link to="/calculator">Energy-Calculator</Link>
                        <Link to="/about">About</Link>
                        <Link to="/resources">Resources</Link>
                        <Link to="/faqs">FAQs</Link>
                    </ul>
                </nav>
            </div>
        </header >
    )
}

export default Navbar