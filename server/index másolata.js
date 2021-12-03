const { ApolloServer, gql } = require('apollo-server')
const { v4: uuid } = require('uuid')

let users = [
  {
    id: 1242323,
    name: 'Mickey Rourke',
  },
  {
    id: 5443233,
    name: 'John McClane'
  },
]

let debts = [
  {
   id: uuid(),
   creditor: 'Mickey Rourke',
   debtor: 'John McClane',
   item: 'coke',
   amount: 1.45,
   settled: 'false',
   dateCreated: new Date('December 17, 1995 12:24:00').toString(),
   dateSettled: null,
  },
  {
   id: uuid(),
   creditor: 'Mickey Rourke',
   debtor: 'John McClane',
   item: 'fries',
   amount: 7.99,
   settled: 'false',
   dateCreated: new Date('November 17, 1995 12:24:00').toString(),
   dateSettled: null,
  },
  {
   id: uuid(),
   creditor: 'John McClane',
   debtor: 'Mickey Rourke',
   item: 'Bud Light',
   amount: 1.99,
   settled: 'false',
   dateCreated: new Date('December 31, 1995 03:33:00').toString(),
   dateSettled: null,
  }
]

const typeDefs = gql`
  type User {
    id: ID!
    name: String!
  }

  type Debt {
    id: ID!
    creditor: User!
    debtor: User!
    item: String!
    amount: Float!
    settled: Boolean!
    dateCreated: String!
    dateSettled: String
  }

  type Query {
    allUsers: [User!]!
    allDebts: [Debt!]!
    amountOwedTo(debtor: String!, creditor: String!): Float!
    amountOwedBy(creditor: String!, debtor: String!): Float!
    totalDebts(debtor: String!): Float!
    totalOwed(creditor: String!): Float!
  }

  type Mutation {
    addDebt(
      creditor: String!
      debtor: String!
      item: String!
      amount: Float!
    ): Debt
  }
`

const resolvers = {
  Debt: {
    creditor: (root) => users.find(user => user.name === root.creditor),
    debtor: (root) => users.find(user => user.name === root.debtor),
  },
  Query: {
    allUsers: () => users,
    allDebts: () => debts,
    amountOwedTo: (root, args) => {
      return(
        debts.reduce((previous, current) => {
          if (current.debtor === args.debtor && current.creditor === args.creditor) {
            return current.amount + previous
          } else {
            return previous
          }
        }, 0)
      )
    },
    amountOwedBy: (root, args) => {
      return(
        debts.reduce((previous, current) => {
          if (current.creditor === args.creditor && current.debtor === args.debtor) {
            return current.amount + previous
          } else {
            return previous
          }
        }, 0)
      )
    },
    totalDebts: (root, args) => debts
      .reduce((previous, current) => {
        return ((current.debtor === args.debtor) 
          ? previous + current.amount 
          : previous
        )
      }, 0),
    totalOwed: (root, args) => debts
      .reduce((previous, current) => {
        return ((current.creditor === args.creditor) 
          ? previous + current.amount 
          : previous
        )
      }, 0),
  },

  Mutation: {
    addDebt: (root, args) => {
      // const creditor = users.find(user => args.creditor === user.name)
      // const debtor = users.find(user => args.debtor === user.name)
      const debt = { 
        ...args,
        id: uuid(),
        settled: false,
        dateCreated: new Date(),
        dateSettled: null
      }
      debts = [ ...debts, debt ]
      return debt
    }
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`)
})