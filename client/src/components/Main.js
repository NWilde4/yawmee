import React from 'react'
import { Routes, Route } from "react-router-dom"
import { Container } from "@chakra-ui/react"

import Home from './Home'
import Balances from './Balances'
import AddLoan from './AddLoan'
import Friends from './Friends'
import Faq from './Faq'
import ErrorPage from './ErrorPage'


const Main = () => {
  return (
    <Container 
      maxW="container.md" 
      centerContent
      my={6} 
      p={4}
      bg="white"
    > 
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/balances" element={<Balances />} />
        <Route path="/add" element={<AddLoan />} />
        <Route path="/friends" element={<Friends />} />
        <Route path="/faq" element={<Faq />} />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </Container>
  )
}

export default Main