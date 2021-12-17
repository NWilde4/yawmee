import React from 'react'
import ReactDOM from 'react-dom'
import { ChakraProvider } from "@chakra-ui/react"
import '@fontsource/m-plus-2'
import { 
  ApolloClient, ApolloProvider, HttpLink, InMemoryCache 
} from '@apollo/client' 
import { setContext } from '@apollo/client/link/context'

import App from './App'
import theme from './theme'

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('user-token')
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : null,
    }
  }
})

const uri = (process.env.NODE_ENV === 'development')
  ? "http://localhost:4000"
  : "https://yawmee.herokuapp.com"

const httpLink = new HttpLink({ uri: `${uri}/graphql`})

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: authLink.concat(httpLink)
})

ReactDOM.render(
  <ApolloProvider client={client}>
    <ChakraProvider theme={theme}>
      <App />
    </ChakraProvider>
  </ApolloProvider>,  
  document.getElementById('root')
)