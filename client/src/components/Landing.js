import React from 'react'
import {
  Box,
  Center,
  Flex,
  Heading,
  Image,
  Text,
  VStack
} from "@chakra-ui/react"

import EntryForm from './EntryForm'

const Description = () => {
  return (
    <Box bg="blue.900">
    </Box>
    )
}

const Landing = ({ setToken }) => {

  return (
   <Flex direction={{ base: 'column', md: 'row' }}>
     <Box w={{ base: '100%', md: '62%' }} h={{ base: 'auto', md: '100vh' }} bg="blue.900">
       <Box pt={{ base: 0, md: 40 }} px={{ base: 2, md: 20 }}>
         <VStack align="left" spacing={{ base: 0, md: 4 }}>
           <Image width={{ base: '240px', md: '480px' }} src='images/logo_cropped.png' />
           <Text fontSize={{ base: 'xl', md: '4xl' }} color="white" pb={{ base: 2, md: 10 }}>A Simple Way To Track Your Loans</Text>
           <Text as="i" fontSize={{ base: 'lg', md: '2xl' }} color="white" pb={2}>"Don't let your friends get away with it"</Text>
        </VStack>
     </Box>
     </Box>
     <Box w={{ base: '100%', md: '38%' }} h={{ base: 'auto', md: '100vh' }} pt={{ base: '5', md: '0' }}>
       <Center h="100%">
         <EntryForm setToken={setToken} />
       </Center>
     </Box>
   </Flex>
  )
}
export default Landing