import React from 'react'
import { useQuery, useMutation } from '@apollo/client'

import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Badge,
  Box,
  Button,
  Center,
  Divider,
  Flex,
  Heading,
  HStack,
  IconButton,
  Spacer,
  StackDivider,
  Text,
  useToast,
  VStack
} from "@chakra-ui/react"
import { AddIcon, MinusIcon, ArrowRightIcon, DeleteIcon } from '@chakra-ui/icons'

import LoadingSpinner from './LoadingSpinner'
import { GET_ALL_BALANCES, SETTLE_BALANCE, GET_TOTAL_BALANCE, REMOVE_LOAN } from '../queries'

const Balances = () => {
  const balancesResult = useQuery(GET_ALL_BALANCES)
  const [settleBalance] = useMutation(SETTLE_BALANCE, {
    refetchQueries: [ {query: GET_ALL_BALANCES}, {query: GET_TOTAL_BALANCE} ]
  })
  const [removeLoan] = useMutation(REMOVE_LOAN, {
    refetchQueries: [ {query: GET_ALL_BALANCES}, {query: GET_TOTAL_BALANCE} ]    
  })

  const toast = useToast()

  const handleClick = (friendObject) => {
    settleBalance({ variables: {counterparty: friendObject.id}})

    toast({
      title: "Success",
      description: `Balance with ${friendObject.name} has been marked as settled.`,
      status: "success",
      duration: 9000,
      isClosable: true,
    })
  }

  const handleLoanRemoval = (id) => {
    removeLoan({ variables: {loanId: id}})
  }


  if (balancesResult.loading) {
    return <LoadingSpinner />
  }

  return (
    <Box w="100%">
      <Center pb={4}>
        <Heading>Balances</Heading>
      </Center>
      <Box w="100%">
        <Accordion allowToggle>
          {balancesResult.data.allBalances.map(friend => {
            const balanceWithFriend = friend.loans.reduce((total, currentLoan) => {
              return total + currentLoan.amount
            }, 0)

            return (
            <AccordionItem key={friend.id} py={15}>
              <h2>
                <AccordionButton>
                  <HStack flex="1" textAlign="left">
                    <Heading as="h3" size="md">{friend.name}</Heading>
                    <Badge variant="solid" fontSize="md" colorScheme={balanceWithFriend > 0 ? "green" : "red"}>{new Intl.NumberFormat('hu-HU').format(balanceWithFriend)} HUF</Badge>
                  </HStack>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel pb={4}>
                <VStack
                  align="left"
                  spacing={4}
                  divider={<StackDivider borderColor="gray.200" />}                
                >
                {friend.loans.map(loan => {
                  return(
                    <Flex>
                      <HStack key={loan.id}>
                        {loan.amount > 0 ? <AddIcon color="green"/> : <MinusIcon color="red.400" />}
                        <Box>
                          <Text as="b">{new Date(Number(loan.createdAt)).toLocaleString()}</Text>
                          <Text>{loan.item}</Text>
                          <Badge colorScheme={loan.amount > 0 ? "green" : "red"}>{new Intl.NumberFormat('hu-HU').format(loan.amount)} HUF</Badge>
                        </Box>
                      </HStack>
                      <Spacer />
                      {loan.amount > 0 &&
                      <IconButton icon={<DeleteIcon />} onClick={() => handleLoanRemoval(loan.id)}/>
                      }
                    </Flex>
                  )
                })}
                </VStack>
                <Divider my={4}/>
                <HStack>
                  <ArrowRightIcon w={10} h={10} color="blue.900" />
                  {balanceWithFriend > 0 
                    ? 
                    <Box>
                        <Text my={2} color="red.400" fontSize="xl">{friend.name} owes you {new Intl.NumberFormat('hu-HU').format(balanceWithFriend)} HUF.</Text>
                        <Text my={2} color="red.400" fontSize="xl">It's up to the two of you how you settle it.</Text>
                        <Text my={2} color="red.400" fontSize="xl">Once the loan is settled, you can remove all loans by clicking the button below.</Text>
                        <Button 
                          colorScheme="blue" 
                          onClick={() => handleClick(friend)}
                        >
                          Mark Loans Settled
                        </Button>
                      </Box>
                    : 
                    <Box>
                      <Text my={2} color="red.400" fontSize="xl">You owe {friend.name} {new Intl.NumberFormat('hu-HU').format(balanceWithFriend * -1)} HUF.</Text>
                      <Text my={2} color="red.400" fontSize="xl">It's up to the two of you how you settle it.</Text>
                      <Text my={2} color="red.400" fontSize="xl">{friend.name} will be able to remove the settled loans from the balance.</Text>
                    </Box>
                  }
                </HStack>
              </AccordionPanel>
            </AccordionItem>
            )
          })}
        </Accordion>
      </Box>
    </Box>
  )
}

export default Balances