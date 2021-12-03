import React from 'react'
import { useQuery } from '@apollo/client'
import {
  Box,
  Center,
  Heading,
  Text,
  VStack
} from "@chakra-ui/react"

import LoadingSpinner from './LoadingSpinner'
import { USER_DATA, GET_TOTAL_BALANCE } from '../queries'

const Home = () => {
  const userResult = useQuery(USER_DATA)
  const balanceResult = useQuery(GET_TOTAL_BALANCE)
  
  const evaluateSituation = (balance) => {
    if (balance > 10000) {
      return "Are your friends still talking to you?"
    } else if (balance > 5000) {
      return "Being a bit generous, huh?"
    } else if (balance > 0) {
      return "Not too bad but better start collecting."
    } else if (balance === 0) {
      return "Either you or your friends are very nice. If you have any."
    } else if (balance < -10000) {
      return "You better start hiding."
    } else if (balance < -5000) {
      return "Now it's really payback time." 
    } else {
      return "Pay it back before it gets out of hand."
    }
  }

  if (userResult.loading || balanceResult.loading) {
    return <LoadingSpinner />
  }

  return (
    <Box>
      <Center pb={4}>
        <Heading>Hi {userResult.data.me.name}!</Heading>
      </Center>
      <Center>
        <Text fontSize="xl">Your current balance is:</Text>
      </Center>
      <VStack>
      <Box
        bg="red.400"
        color="white"
        m={6}
        p={8}
        borderStyle="solid"
        borderColor="red.400"
        borderRadius={'xl'}
        boxShadow={'xl'}
        maxW={"sm"}
        textAlign="center"
      >
        <Heading as="h3" size="xl">{(new Intl.NumberFormat('hu-HU').format(balanceResult.data.getTotalBalance))} HUF</Heading>
      </Box>
      </VStack>
      <Center mt={12}>
        <Heading as="h4" size="lg">{evaluateSituation(balanceResult.data.getTotalBalance)}</Heading>
      </Center>
    </Box>
  )
}

export default Home