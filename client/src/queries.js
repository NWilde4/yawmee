import { gql } from '@apollo/client'

export const USER_DATA = gql`
  query getUserByToken {
    me {
      name
      username
      email
      password
    }
  }
`

export const GET_FRIENDS = gql`
  query getFriendsById {
    getFriends {
      id
      friend {
        id
        username
        name
        email
      }
      isTarget
      status
    }
  }
`
export const CREATE_FRIEND = gql`
  mutation addFriendByUsername ($target: String!) {
    addFriend(
      target: $target
    ) {
      status
    }
  }
`

export const UPDATE_FRIENDSHIP = gql`
  mutation updateFriendshipById ($friendshipId: String!, $action: String!) {
    updateFriendship(
      friendshipId: $friendshipId,
      action: $action
    ) {
      status
    }
  }
`

export const CREATE_USER = gql`
  mutation addNewUser ($name: String!, $username: String!, $email: String!, $password: String!,) {
    addUser(
      name: $name,
      username: $username,
      email: $email,
      password: $password
    ) {
      username
    }
  }
`

export const LOGIN_USER = gql`
  mutation loginUser ($username: String!, $password: String!) {
    login(
      username: $username,
      password: $password
    ) {
      value
    }
  }
`

export const CREATE_LOAN = gql`
  mutation createLoan($counterparty: String!, $item: String!, $amount: Float!) {
    addLoan(
      counterparty: $counterparty,
      item: $item,
      amount: $amount
    ) {
      item
      debtor {
        name
      }
    }
  }
`

export const SETTLE_BALANCE = gql`
  mutation deleteLoans($counterparty: String!) {
    settleBalance(
      counterparty: $counterparty,
    )
  }
`

export const GET_TOTAL_BALANCE = gql`
  query GetTotalBalance {
    getTotalBalance
  }
`

export const GET_ALL_BALANCES = gql`
  query GetAllBalances {
    allBalances {
      id
      name
      loans {
        id
        amount
        item
        createdAt
      }
    }
  }
`