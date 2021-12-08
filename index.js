const express = require('express')
const { ApolloServer, gql, UserInputError } = require('apollo-server-express')
const { ApolloServerPluginDrainHttpServer } = require('apollo-server-core')
const http = require('http')
const bcrypt = require('bcrypt')
const { v4: uuid } = require('uuid')
const { prisma } = require("./src/database.js");
const jwt = require('jsonwebtoken')

const typeDefs = gql`

  type Token {
    value: String!
  }

  type User {
    id: ID!
    name: String!
    username: String!
    email: String!
    password: String!
    credit: [Loan]
    debt: [Loan]
    loans: [UserLoan]
    createdAt: String!
  }

  type Friendship {
    id: ID!
    requester: User!
    target: User!
    status: String!
    createdAt: String!
  }

  type UserFriend {
    id: ID!
    friend: User!
    isTarget: Boolean!
    status: String!
    createdAt: String!
    loansWith: [UserLoan]
  }

  type Loan {
    id: ID!
    creditor: User!
    debtor: User!
    item: String!
    amount: Float!
    settled: Boolean!
    createdAt: String!
    settledAt: String
  }

  type UserLoan {
    id: ID!
    counterparty: User
    type: String!
    item: String!
    amount: Float!
    settled: Boolean!
    createdAt: String!
    settledAt: String
  }

  type Query {
    me: User
    getUser(id: String!): User
    getFriends: [UserFriend!]
    getTotalBalance: Float!
    allBalances: [User]
  }

  type Mutation {
    addUser(
      name: String!
      username: String!
      email: String!
      password: String!
    ): User

    login(
      username: String!
      password: String!
    ): Token

    addLoan(
      counterparty: String!
      item: String!
      amount: Float!
    ): Loan

    settleBalance(
      counterparty: String!
    ): String

    addFriend(
      target: String!
    ): Friendship

    updateFriendship(
      friendshipId: String!
      action: String!
    ): Friendship

  }

`

const resolvers = {
  Query: {
    me: (root, args, context) => {
      return context.currentUser
    },
    allBalances: async (root, args, context) => {
      const fetchedFriends = await prisma.user.findMany({
        where: {
          OR: [
            {
              friendsAsRequester: {
                some: {
                  targetId: context.currentUser.id,
                  status: 'active'
                }
              }
            },
            {
              friendsAsTarget: {
                some: {
                  requesterId: context.currentUser.id,
                  status: 'active'
                }
              }
            }
          ]
        },
        include: {
          credit: {
            where: {
              debtorId: context.currentUser.id
            },
            include: {
              debtor: true
            },
          },
          debt: {
            where: {
              creditorId: context.currentUser.id
            },
            include: {
              creditor: true
            },
          },
        }
      })

      const friendListWithLoans = fetchedFriends
        .map((friendObject) => {
          const creditsWithFriend = friendObject.credit.map((credit) => {
            credit.amount *= -1
            return credit
          })
          const friendWithLoans = {...friendObject, loans: [...creditsWithFriend, ...friendObject.debt]}
          
          return friendWithLoans
        })
        .filter((friendObject) => friendObject.loans.length > 0) //Only show friends with non-zero balance

      return friendListWithLoans
    },
    getFriends: async (rood, args, context) => {
      const fetchedFriendships = await prisma.friendship.findMany({
        where: {
          OR: [
            {
              requesterId: context.currentUser.id,
            },
            {
              targetId: context.currentUser.id,
            }
          ],
        },
        include: {
          requester: true,
          target: true
        }
      })

      const userFriends = fetchedFriendships.map(friend => {
        if (friend.requesterId === context.currentUser.id) {
          friend.friend = friend.target
          friend.isTarget = false
        } else {
          friend.friend = friend.requester
          friend.isTarget = true
        }

        delete friend.requester
        delete friend.requesterId
        delete friend.target
        delete friend.targetId

        return friend
      })

      return userFriends
    },
    getTotalBalance: async (root, args, context) => {
      const fetchedLoans = await prisma.loan.findMany({
        where: {
          OR: [
            {
              creditorId: context.currentUser.id,
            },
            {
              debtorId: context.currentUser.id
            }
          ]
        }
      })

      const balance = fetchedLoans.reduce((total, current) => {
        if (current.debtorId === context.currentUser.id) {
          return total - current.amount
        }
        return total + current.amount
      }, 0)

      return balance
    }
  },

  Mutation: {
    addUser: async (root, args) => {
      const existingUser = await prisma.user.findFirst({
        where: {
          OR: [
            {
              username: args.username
            },
            {
              email: args.email
            }
          ]
        }
      })

      if (existingUser && existingUser.username === args.username) {
        throw new UserInputError('This username already exists.')
      }

      if (existingUser && existingUser.email === args.email) {
        throw new UserInputError('This email address has already been registered.')
      }

      const saltRounds = 10

      const passwordHash = await bcrypt.hash(args.password, saltRounds)

      const newUser = await prisma.user.create({
        data: {
          name: args.name,
          username: args.username,
          email: args.email,
          password: passwordHash,
        },
      })

      return newUser
    },
    login: async (root, args) => {
      const fetchedUser = await prisma.user.findUnique({
        where: {
          username: args.username,
        },
      })

      if (!fetchedUser) {
        throw new UserInputError("Wrong username.")
      }

      const passwordCorrect = await bcrypt.compare(args.password, fetchedUser.password)

      if (!passwordCorrect) {
        throw new UserInputError("Wrong password.")
      }

      const userForToken = {
        username: fetchedUser.username,
        id: fetchedUser.id
      }

      return { value: jwt.sign(userForToken, process.env.SECRET_KEY) }
    },
    addLoan: async (root, args, context) => {
      const newLoan = await prisma.loan.create({
        data: {
          creditorId: context.currentUser.id,
          debtorId: args.counterparty,
          item: args.item,
          amount: args.amount,
        },
        include: {
          debtor: true
        }
      })
      return newLoan
    },
    settleBalance: async (root, args, context) => {
      const deleteLoans = await prisma.loan.deleteMany({
        where: {
          OR: [
            {
              creditorId: context.currentUser.id,
              debtorId: args.counterparty,
            },
            {
              creditorId: args.counterparty,
              debtorId: context.currentUser.id,
            }
          ],
        },
      })

      return "whatever"
    },
    addFriend: async (root, args, context) => {
      const targetedFriend = await prisma.user.findUnique({
        where: {
          username: args.target
        },
        select: {
          id: true
        }
      })

      if (!targetedFriend) {
        throw new UserInputError(`User ${args.target} doesn't exist.`)
      }

      const { id: targetId } = targetedFriend

      const existingFriendship = await prisma.friendship.findFirst({
        where: {
          OR: [
            {
              requesterId: context.currentUser.id,
              targetId: targetId, 
            },
            {
              requesterId: targetId,
              targetId: context.currentUser.id
            }
          ]
        },
      })

      if (existingFriendship) {
        throw new UserInputError("You can't become friends again.")
      } 

      const newFriendship = await prisma.friendship.create({
        data: {
          requesterId: context.currentUser.id,
          targetId: targetId,
          status: 'pending'
        },
      })

      return newFriendship
    },
    updateFriendship: async (root, args) => {
      if (args.action === 'remove') {
        const deleteFriendship = await prisma.friendship.delete({
          where: {
            id: args.friendshipId
          }
        })

        const friend1Id = deleteFriendship.requesterId
        const friend2Id = deleteFriendship.targetId

        await prisma.loan.deleteMany({
          where: {
            OR: [
              {
                creditorId: friend1Id,
                debtorId: friend2Id
              },
              {
                debtorId: friend1Id,
                creditorId: friend2Id
              }
            ]
          }
        })

        return deleteFriendship
      }


      const updatedFriendship = await prisma.friendship.update({
        where: {
          id: args.friendshipId
        },
        data: {
          status: 'active'
        }
      })

      return updatedFriendship
    },
  }
}

const startApolloServer = async (typeDefs, resolvers) => {
  const app = express()
  app.use(express.static('client/build'))
  const httpServer = http.createServer(app)
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    context: async ({ req }) => {
      const auth = req ? req.headers.authorization : null
      if (auth && auth.toLowerCase().startsWith('bearer ')) {
        const decodedToken = jwt.verify(auth.substring(7), process.env.SECRET_KEY)
        const currentUser = await prisma.user.findUnique({
          where: {
            id: decodedToken.id
          }
        })
        return { currentUser }
      }
    },
  })

  const PORT = process.env.PORT || 4000

  await server.start()
  server.applyMiddleware({ app })
  await new Promise(resolve => httpServer.listen(PORT, resolve))
  console.log(`🚀 Server ready on port ${PORT}${server.graphqlPath}`)
}

startApolloServer(typeDefs, resolvers)