import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useApolloClient } from '@apollo/client'

const Logout = ({ setToken }) => {
  const navigate = useNavigate()
  const client = useApolloClient()
  
  const handleClick = () => {
    setToken(null)
    localStorage.clear()
    navigate('/')
    client.clearStore() 
  }

  return (
    <button onClick={handleClick}>
      Sign Out
    </button>
  )
}

export default Logout