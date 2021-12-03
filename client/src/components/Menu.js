import React from 'react'
import {
  BrowserRouter as Router,
  Routes, Route, Link,
} from "react-router-dom"

import Home from './components/Home'
import Navigation from './components/Navigation'
import Balance from './components/Balance'
import AddLoan from './components/AddLoan'
import Friends from './components/Friends'
import Faq from './components/Faq'
import SignUp from './components/SignUp'
import Login from './components/Login'
import Logout from './components/Logout'

const Menu = ({ setToken }) => {
  const navigate = useNavigate()
  const client = useApolloClient()
  
  const handleClick = () => {
    setToken(null)
    localStorage.clear()
    navigate('/')
    client.clearStore() 
  }

  return (
    <Button variant="contained" onClick={handleClick}>
      Logout
    </Button>
  )
}

export default Menu