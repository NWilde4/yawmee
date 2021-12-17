import React, { useState } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import {
  Box,
  ButtonGroup,
  Center,
  Divider,
  Flex,
  FormControl,
  Heading,
  IconButton,
  Input,
  Spacer,
  Text,
  VStack,
  useToast,
} from "@chakra-ui/react"
import { DeleteIcon, CloseIcon, CheckIcon, EmailIcon } from '@chakra-ui/icons'

import LoadingSpinner from './LoadingSpinner'
import { 
  CREATE_FRIEND, 
  GET_FRIENDS, 
  UPDATE_FRIENDSHIP, 
  GET_ALL_BALANCES, 
  GET_TOTAL_BALANCE 
} from '../queries'


const Friends = () => {
  const result = useQuery(GET_FRIENDS)
  const [createFriend] = useMutation(CREATE_FRIEND, {
    refetchQueries: [ {query: GET_FRIENDS} ],
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.graphQLErrors[0].message,
        status: 'error',
        duration: 9000,
        isClosable: true,
      })
    }
  })
  const [updateFriendship] = useMutation(UPDATE_FRIENDSHIP, {
    refetchQueries: [ {query: GET_FRIENDS}, {query: GET_ALL_BALANCES}, {query: GET_TOTAL_BALANCE} ]
  })

  const [friendRequestName, setFriendRequestName] = useState('')
  const toast = useToast()

  const handleSubmit = (event) => {
    event.preventDefault()
    createFriend({ variables: { 
      target: friendRequestName
     } })
    setFriendRequestName('')
  }

  const updateFriend = (friendshipId, action) => {
    console.log(friendshipId + action)
    updateFriendship({ variables: { friendshipId, action }})
  }

  if (result.loading) {
    return <LoadingSpinner />
  }

  return (
    <Box w="100%">
      <Center pb={4}>
        <Heading>Friends</Heading>
      </Center>
      <VStack spacing={8}>
        <Box w="100%">
          <Heading as="h4" size="lg" mb={4} color="red.400">Your Friends</Heading>
          <VStack align="stretch" spacing={4}>
              {result.data.getFriends.filter(f => f.status === 'active').length === 0
                ? <Heading size="sm">You haven't connected with any friends yet</Heading>
                : result.data.getFriends
                .filter(friendObject => friendObject.status === 'active')
                .map(friendObject => {
                  return (
                    <Box key={friendObject.id}>
                      <Flex>
                        <Box>
                          <Heading size="sm">{friendObject.friend.name} ({friendObject.friend.username})</Heading>
                          <Text>{friendObject.friend.email}</Text>
                        </Box>
                        <Spacer />
                        <IconButton icon={<DeleteIcon />} onClick={() => {updateFriend(friendObject.id, 'remove')}} />
                      </Flex>
                      <Divider />
                    </Box>
                  )
                  })
              }
          </VStack>          
        </Box>
        <Box w="100%">
          <Heading as="h4" size="lg" mb={4} color="red.400">Pending Requests</Heading>
          <VStack align="stretch" spacing={4}>
              {result.data.getFriends.filter(f => f.status === 'pending').length === 0
                ? <Heading size="sm">You don't have any pending friend requests</Heading>
                : result.data.getFriends
                  .filter(friendObject => friendObject.status === 'pending')
                  .map(friendObject => {
                    return (
                      <Box key={friendObject.id}>
                        <Flex>
                          <Box>
                            <Heading size="sm">{friendObject.friend.name} ({friendObject.friend.username})</Heading>
                            <Text>{friendObject.friend.email}</Text>
                          </Box>
                          <Spacer />
                          {friendObject.isTarget
                            ? <ButtonGroup isAttached>
                                <IconButton icon={<CheckIcon />} mr="-px" onClick={() => {updateFriend(friendObject.id, 'accept')}} />
                                <IconButton icon={<CloseIcon />} onClick={() => {updateFriend(friendObject.id, 'remove')}} />
                              </ButtonGroup>
                            : <IconButton icon={<DeleteIcon />} onClick={() => {updateFriend(friendObject.id, 'remove')}} />
                          }
                        </Flex>
                        <Divider />
                      </Box>
                    )
                    })
                }
          </VStack>          
        </Box>
        <Box w="100%">
          <Heading as="h4" size="lg" mb={4} color="red.400">Add Friend</Heading>
          <form onSubmit={handleSubmit}>
            <Flex>
              <FormControl isRequired>
                <Input 
                  maxW="99%"
                  type="text" 
                  value={friendRequestName} 
                  placeholder="Friend's Username"
                  onChange={({ target }) => {setFriendRequestName(target.value)}} 
                />
              </FormControl>
              <IconButton icon={<EmailIcon />} type='submit' />
            </Flex>
          </form>
        </Box>
      </VStack>
    </Box>
  )
}

export default Friends