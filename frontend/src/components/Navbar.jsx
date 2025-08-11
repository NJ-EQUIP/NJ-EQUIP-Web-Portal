import React from 'react'
import { Link } from 'react-router-dom'

function Navbar() {
    return (
        <header>
            <div className='navbar'>
                <Link to="/" className='logo-link'>
                    <div className='logo-crop'>
                        <img src="logo.png" alt="NJ-Equip" className='navbar-logo'></img>
                    </div>
                </Link>
                <nav>
                    <ul>
                        <Link to="/">Home</Link>
                        <Link to="/map">Map</Link>
                        <Link to="/calculator">Energy-Calculator</Link>
                        <Link to="/sentiment">Public-Sentiment</Link>
                        <Link to="/about">About</Link>
                        <Link to="/faqs">FAQs</Link>
                    </ul>
                </nav>
            </div>
        </header >
    )
}

export default Navbar