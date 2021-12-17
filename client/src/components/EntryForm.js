import React, { useState, useEffect } from 'react'
import { useMutation } from '@apollo/client'
import {
  Box,
  Button,
  Divider,
  FormControl,
  FormLabel,
  Heading,
  Input,
  useToast,
  VStack,
} from "@chakra-ui/react"

import { LOGIN_USER, CREATE_USER } from '../queries'

const EntryForm = ({ setToken }) => {
  const [entryForm, setEntryForm] = useState('logIn')
  const [name, setName] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const toast = useToast()

  const [logInUser, result] = useMutation(LOGIN_USER, {
    onError: (error) => {
      console.log(error)
      toast({
        title: 'Error',
        description: error.graphQLErrors[0].message,
        status: 'error',
        duration: 9000,
        isClosable: true,
      })
    }
  })

  const [createUser] = useMutation(CREATE_USER, {
    onError: (error) => {
      console.log(error)
      toast({
        title: 'Error',
        description: error.graphQLErrors[0].message,
        status: 'error',
        duration: 9000,
        isClosable: true,
      })
    }    
  })

  useEffect(() => {
    if (result.data) {
      const token = result.data.login.value
      setToken(token)
      localStorage.setItem('user-token', token)
    }
  }, [result.data]) // eslint-disable-line

  const handleFormSwitch = () => {
    (entryForm === 'logIn') ? setEntryForm('signUp') : setEntryForm('logIn')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    let variables = {
      username,
      password,
      name,
      email
    }
    if (entryForm === 'logIn') {
      logInUser({ variables })
      setUsername('')
      setPassword('')
    } else {
      await createUser({ variables })
      toast({
        title: 'Success',
        description: `Account created for ${name} (${username})`,
        status: 'success',
        duration: 9000,
        isClosable: true,
      })
      setEntryForm('logIn')
    }
    setName('')
    setEmail('')
  }

  return (
    <Box
      mx={4}
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
        <Heading>{(entryForm === 'logIn') ? "Log In" : "Sign Up"}</Heading>
        <Divider />
        <form onSubmit={handleSubmit}>
          <VStack>
            {entryForm === 'signUp' &&
            <FormControl>
              <FormLabel>Name</FormLabel>
              <Input type='text' value={name} required onChange={({ target }) => {setName(target.value)}}/>
            </FormControl>
            }
            {entryForm === 'signUp' &&
            <FormControl>
              <FormLabel>Email</FormLabel>
              <Input type='email' value={email} required onChange={({ target }) => {setEmail(target.value)}}/>
            </FormControl>
            }
            <FormControl>
              <FormLabel>Username</FormLabel>
              <Input type='text' value={username} required onChange={({ target }) => {setUsername(target.value)}}/>
            </FormControl>
            <FormControl>
              <FormLabel>Password</FormLabel>
              <Input type='password' value={password} required onChange={({ target }) => {setPassword(target.value)}}/>
            </FormControl>
            <Button type='submit' isFullWidth colorScheme="red" bg="red.400">{(entryForm === 'logIn') ? "Submit" : "Create Account"}</Button>
          </VStack>
        </form>
        <Divider />
        <Button size="sm" colorScheme="blue" color="white" onClick={handleFormSwitch}>
          {(entryForm === 'logIn') ? "Don't have an account?" : "Already registered?"}
        </Button>
      </VStack>
    </Box>
  )
}

export default EntryForm