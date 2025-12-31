//import { useState } from 'react'
//import reactLogo from './assets/react.svg'
//import viteLogo from '/vite.svg'
import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './components/Home'
import About from './components/About'
import Resources from './components/Resources'
import FAQs from './components/FAQs'
import Map from './components/map/Map'
import Calculator from './components/Calculator'
import Sentiment from './components/Sentiment'
import './App.css'

function App() {
  return (
      <div className='app-container'>
        <Navbar />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/about' element={<About />} />
          <Route path='/resources' element={<Resources />} />
          {/* <Route path='/faqs' element={<FAQs />} />*/}
          <Route path='/map' element={<Map />} />
          <Route path='/calculator' element={<Calculator />} />
          <Route path='/sentiment' element={<Sentiment />} />
          {/*<Route path='/sentiment/:collection' element={<Sentiment />} />*/}
        </Routes>
      </div>
  )
}

export default App
