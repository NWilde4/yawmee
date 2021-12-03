import React from 'react'
import { 
  Box,
  Text,
  VStack,
 } from "@chakra-ui/react"

const Footer = () => {

  return (
    <Box bg="red.400" w="100%" p={4} color="white">
      <VStack>
        <Text>Made by Norman Wilde</Text>
      </VStack>
    </Box>
  )
}

export default Footer