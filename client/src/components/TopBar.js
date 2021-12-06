import React from 'react'
import { Link as RouterLink } from "react-router-dom"
import { 
  Box,
  Flex,
  Image,
  Spacer,
  HStack,
  Link
 } from "@chakra-ui/react"

import Logout from './Logout'
import MobileNav from './MobileNav'

const TopBar = ({ setToken }) => {

  return (
    <Box bg="brand.900" w="100%" p={2} color="red.400">
      <Flex align="center">
        <Box>
          <Image width="180px" src='images/logo_cropped.png' />
        </Box>
        <Spacer />
        <Box display={{ base: 'none', md: 'block' }}>
          <HStack spacing={4}>
            <Link as={RouterLink} to="/">Home</Link>
            <Link as={RouterLink} to="/balances">Balances</Link>
            <Link as={RouterLink} to="/add">Add Loan</Link>
            <Link as={RouterLink} to="/friends">Friends</Link>
            <Link as={RouterLink} to="/faq">FAQ</Link>
            <Logout setToken={setToken} />
          </HStack>
        </Box>      
        <Box display={{ base: 'block', md: 'none' }}>
          <HStack>
            <MobileNav setToken={setToken} />
          </HStack>
        </Box>      
      </Flex>
    </Box>
  )
}

export default TopBar