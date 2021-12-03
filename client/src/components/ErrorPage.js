import React from 'react'
import {
  Box,
  Center,
  Heading,
  SkeletonText,
} from "@chakra-ui/react"

const ErrorPage = () => {
  return (
    <Box w="100%">
      <Center pb={4}>
        <Heading>Oh no! This page doesn't exist.</Heading>
      </Center>
      <SkeletonText mt='4' noOfLines={12} spacing='4' />
    </Box>
  )
}
export default ErrorPage