//import { useState } from 'react'
//import reactLogo from './assets/react.svg'
//import viteLogo from '/vite.svg'
import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './components/Home'
import About from './components/About'
import Resources from './components/Resources'
import FAQs from './components/FAQs'
import Map from './components/Map'
import Calculator from './components/Calculator'
import './App.css'

function App() {
  return (
    <Router>
      <div className='app-container'>
        <Navbar />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/about' element={<About />} />
          <Route path='/resources' element={<Resources />} />
          <Route path='/faqs' element={<FAQs />} />
          <Route path='/map' element={<Map />} />
          <Route path='/calculator' element={<Calculator />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
