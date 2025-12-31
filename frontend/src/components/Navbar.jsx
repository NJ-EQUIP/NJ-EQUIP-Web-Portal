import React, { useState } from 'react'
import { Link } from 'react-router-dom'

function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header>
      <div className={`navbar ${open ? 'is-open' : ''}`}>
        <Link
          to="/"
          className="logo-link"
          onClick={() => setOpen(false)}
        >
          <div className="logo-crop">
            <img
              src="logo3.png"
              alt="NJ-Equip"
              className="navbar-logo"
            />
          </div>
        </Link>

        <nav>
          <div className="nav-menu">
            <button
              className="nav-toggle"
              aria-expanded={open}
              aria-controls="primary-nav"
              onClick={() => setOpen(v => !v)}
            >
              ☰
            </button>

            <ul
              id="primary-nav"
              className={open ? 'is-open' : ''}
            >
              <li><Link to="/" onClick={() => setOpen(false)}>Home</Link></li>
              <li><Link to="/map" onClick={() => setOpen(false)}>Map</Link></li>
              <li><Link to="/calculator" onClick={() => setOpen(false)}>Energy-Calculator</Link></li>
              <li><Link to="/sentiment" onClick={() => setOpen(false)}>Public-Sentiment</Link></li>
              <li><Link to="/resources" onClick={() => setOpen(false)}>Resources</Link></li>
              <li><Link to="/about" onClick={() => setOpen(false)}>Contact</Link></li>
            </ul>
          </div>
        </nav>
      </div>
    </header>
  )
}

export default Navbar
