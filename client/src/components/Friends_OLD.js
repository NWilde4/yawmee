import React, { useState } from 'react'
import { useQuery, useMutation } from '@apollo/client'

import { CREATE_FRIEND, GET_FRIENDS } from '../queries'

const USERID = 'ad7d724c-1625-4677-bb76-e23fb0b8cd03'

const Friends = () => {
  const result = useQuery(GET_FRIENDS, { variables: { userId: USERID } })
  const [createFriend] = useMutation(CREATE_FRIEND)
  const [friendRequestName, setFriendRequestName] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    createFriend({ variables: { 
      requesterId: USERID,
      target: friendRequestName
     } })
    setFriendRequestName('')
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
        ACTIVE FRIENDS 
        {result.data.getFriends
          .filter(friendObject => friendObject.status === 'active')
          .map(friendObject => {
            return(
              <div key={friendObject.id}>{friendObject.friend.username} - {friendObject.friend.id}</div>
            )
          })
        }
      </div>
      <div>
        PENDING FRIENDS 
        {result.data.getFriends
          .filter(friendObject => friendObject.status === 'pending')
          .map(friendObject => {
            return(
              <div key={friendObject.id}>{friendObject.friend.username} - {friendObject.friend.id}</div>
            )
          })
        }
      </div>
    </div>
  )
}

export default Friends