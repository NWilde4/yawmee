import React, { useState } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import {
  Button,
  Center,
  FormControl,
  FormLabel,
  Heading,
  Input,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Select,
  useToast,
  VStack,
} from "@chakra-ui/react"

import LoadingSpinner from './LoadingSpinner'
import { CREATE_LOAN, GET_FRIENDS, GET_ALL_BALANCES, GET_TOTAL_BALANCE } from '../queries'

const AddLoan = () => {
  const [counterparty, setCounterparty] = useState('default')
  const [amount, setAmount] = useState('')
  const [item, setItem] = useState('')
  const toast = useToast()

  const result = useQuery(GET_FRIENDS)
  const [createLoan] = useMutation(CREATE_LOAN, {
    refetchQueries: [ {query: GET_ALL_BALANCES}, {query: GET_TOTAL_BALANCE} ]
  })

  const handleSubmit = (event) => {
    event.preventDefault()
    let variables = {
      counterparty,
      amount: Number(amount),
      item
    }
    createLoan({ variables })

    const counterpartyName = result.data.getFriends.find(friendObject=>friendObject.friend.id === counterparty).friend.name

    toast({
      title: "Success",
      description: `Loan with ${counterpartyName} has been added.`,
      status: "success",
      duration: 9000,
      isClosable: true,
    })
    
    setAmount('')
    setItem('')

  }

  if (result.loading) {
    return <LoadingSpinner />
  }

  return (
    <div>
      <Center pb={4}>
        <Heading>Add Loan</Heading>
      </Center>
      <form onSubmit={handleSubmit}>
        <VStack align="stretch">
          <FormControl>
            <FormLabel>Your friend</FormLabel>
            <Select required defaultValue={counterparty} onChange={({ target }) => setCounterparty(target.value)}>
              <option value="default" disabled hidden>Select Friend</option>
              {result.data.getFriends
                .filter(friendObject => friendObject.status === 'active')
                .map(friendObject => {
                return(<option key={friendObject.friend.id} value={friendObject.friend.id}>{friendObject.friend.name}</option>)
              })}
            </Select>
          </FormControl>
          <FormControl>
            <FormLabel>owes you</FormLabel>
            <NumberInput 
              value={amount}
            >
              <NumberInputField 
                onChange={({ target }) => setAmount(target.value)}
                required
                placeholder="HUF"
              />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </FormControl>
          <FormControl>
            <FormLabel>for</FormLabel>
            <Input 
              onChange={({ target }) => setItem(target.value)}
              required
              placeholder="Item Name"
              value={item}
            />
          </FormControl>
          <Button isFullWidth colorScheme="blue" color="white" type='submit'>Add Loan</Button>
        </VStack>
      </form>
    </div>
  )
}

export default AddLoan