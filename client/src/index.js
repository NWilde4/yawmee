import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import { ChakraProvider } from "@chakra-ui/react"
import theme from './theme'
import '@fontsource/m-plus-2'
import { 
  ApolloClient, ApolloProvider, HttpLink, InMemoryCache 
} from '@apollo/client' 
import { setContext } from '@apollo/client/link/context'

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('user-token')
  return {
    headers: {
      ...headers,
      authorization: token ? `bearer ${token}` : null,
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