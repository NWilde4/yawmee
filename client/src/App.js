import React, { useState, useEffect } from 'react'
import {
  BrowserRouter as Router,
  Routes, Route
} from "react-router-dom"

import { Box, SimpleGrid } from "@chakra-ui/react"

import Landing from './components/Landing'
import TopBar from './components/TopBar'
import Main from './components/Main'
import Footer from './components/Footer'

const App = () => {
  const [token, setToken] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem('user-token')
    if (token) {
      setToken(token)
    }
  }, [])

  if (!token) {
    return(
      <div>
      <Router>
        <Routes>
          <Route path="/" element={<Landing setToken={setToken} />} />
        </Routes>
      </Router>
      </div>
    )
  }

  return(
    <Box >
      <Router>
        <SimpleGrid
          minHeight="100vh"
          templateRows="auto 1fr auto"
        >
          <TopBar setToken={setToken} />
          <Main />
          <Footer />
        </SimpleGrid>
      </Router>
    </Box>
  )
}

export default App
