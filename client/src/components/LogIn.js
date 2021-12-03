import React, { useState, useEffect } from 'react'
import { useMutation } from '@apollo/client'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Button,
  Divider,
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Heading,
  Input,
  VStack,
} from "@chakra-ui/react"

import { LOGIN_USER } from '../queries'

const LogIn = ({ setToken, handleFormSwitch }) => {
  // const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const [loginUser, result] = useMutation(LOGIN_USER)

  useEffect(() => {
    if (result.data) {
      const token = result.data.login.value
      setToken(token)
      localStorage.setItem('user-token', token)
      // navigate('/')
    }
  }, [result.data]) // eslint-disable-line

  const handleSubmit = (event) => {
    event.preventDefault()
    let variables = {
      username,
      password
    }
    loginUser({ variables })

    setUsername('')
    setPassword('')
  }

  return (
    <Box
      px={10}
      py={4}
      border={4} 
      borderStyle="solid"
      borderColor="red.400"
      borderRadius={'xl'}
      boxShadow={'lg'}
      bg="gray.50"
    > 
      <VStack spacing={4}>
        <Heading>Log in</Heading>
        <form onSubmit={handleSubmit}>
          <VStack>
            <FormControl>
              <FormLabel>Username</FormLabel>
              <Input type='text' value={username} required onChange={({ target }) => setUsername(target.value)}/>
            </FormControl>
            <FormControl>
              <FormLabel>Password</FormLabel>
              <Input type='password' value={password} required onChange={({ target }) => setPassword(target.value)}/>
            </FormControl>
            <Button type='submit' isFullWidth colorScheme="red" bg="red.400">Log In</Button>
          </VStack>
        </form>
        <Divider />
        <Button isFullWidth colorScheme="blue" color="white" onClick={handleFormSwitch}>Create Account</Button>
      </VStack>
    </Box>
  )
}

export default LogIn