import React, { useState } from 'react'
import { useMutation } from '@apollo/client'
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Heading,
  Input
} from "@chakra-ui/react"

import { CREATE_USER } from '../queries'

const SignUp = ({ handleFormSwitch }) => {
  const [name, setName] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [createUser] = useMutation(CREATE_USER)

  const handleSubmit = (event) => {
    event.preventDefault()
    let variables = {
      name,
      username,
      email,
      password
    }
    createUser({ variables })

    setName('')
    setUsername('')
    setEmail('')
    setPassword('')
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          name
          <input type='text' value={name} required onChange={({ target }) => setName(target.value)}/>
        </div>
        <div>
          username
          <input type='text' value={username} required onChange={({ target }) => setUsername(target.value)}/>
        </div>        
        <div>
          email
          <input type='email' value={email} required onChange={({ target }) => setEmail(target.value)}/>
        </div>
        <div>
          password
          <input type='password' value={password} required onChange={({ target }) => setPassword(target.value)}/>
        </div>
        <button type='submit'>Submit</button>
      </form>
      <Button onClick={handleFormSwitch}>Already have an account? Sign in</Button>
    </div>
  )
}

export default SignUp