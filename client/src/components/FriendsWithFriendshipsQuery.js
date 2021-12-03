import React, { useState } from 'react'
import { useQuery, useMutation } from '@apollo/client'

import { CREATE_FRIEND, GET_FRIENDSHIPS, UPDATE_FRIENDSHIP } from '../queries'
// FUUUUUUUUUUUUUUUUUUUUCK USERID ALUL MIÉRT?????????????
const USERID = 'ad7d724c-1625-4677-bb76-e23fb0b8cd03'

const Friends = () => {
  const result = useQuery(GET_FRIENDSHIPS)
  const [createFriend] = useMutation(CREATE_FRIEND)
  const [updateFriendship] = useMutation(UPDATE_FRIENDSHIP)

  const [friendRequestName, setFriendRequestName] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    createFriend({ variables: { 
      target: friendRequestName
     } })
    setFriendRequestName('')
  }

  const acceptFriendRequest = (event) => {
    event.preventDefault()
    const friendshipId = event.target.value
    updateFriendship({ variables: {friendshipId, action: 'accept'}})
  }

  const removeFriendRequest = (event) => {
    event.preventDefault()
    const friendshipId = event.target.value
    updateFriendship({ variables: {friendshipId, action: 'remove'}})
  }

  if (result.loading) {
    return <div>loading...</div>
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        add friend by username
        <input type="text" value={friendRequestName} onChange={({ target }) => setFriendRequestName(target.value)} />
        <button type='submit'>Submit</button>
      </form>
      <div>
        <br/>ACTIVE FRIENDS 
        {result.data.getFriendships
          .filter(friendshipObject => friendshipObject.status === 'active')
          .map(friendshipObject => {
            const friendObject = (friendshipObject.requester.id === USERID)
              ? friendshipObject.target
              : friendshipObject.requester
            return(
              <div key={friendObject.id}>
                {friendObject.username}
                <button value={friendshipObject.id} onClick={removeFriendRequest}>remove</button>
              </div>
            )
          })
        }
      </div>
      <div>
        <br/>PENDING FRIEND REQUESTS
        {result.data.getFriendships
          .filter(friendshipObject => friendshipObject.status === 'pending')
          .map(friendshipObject => {
            const friendObject = (friendshipObject.requester.id === USERID)
              ? friendshipObject.target
              : friendshipObject.requester
            const isRequest = (friendshipObject.target.id === USERID) || false
            return(
              <div key={friendObject.id}>
                {friendObject.username}
                {isRequest
                  ? <>
                      <button value={friendshipObject.id} onClick={acceptFriendRequest}>accept</button>
                      <button value={friendshipObject.id} onClick={removeFriendRequest}>decline</button>
                    </>
                  : <button value={friendshipObject.id} onClick={removeFriendRequest}>withdraw</button>
                }
              </div>
            )
          })
        }
      </div>
    </div>
  )
}

export default Friends