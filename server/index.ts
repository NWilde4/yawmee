// npx ts-node index.ts
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  // await prisma.user.create({
  //   data: {
  //     name: 'John Rambo',
  //     username: 'faszom',
  //     email: 'faszom@gmail.com',
  //     password: 'faszompw',
  //     createdAt: new Date('December 17, 1995 12:24:00'),
  //   },
  // })
  await prisma.user.delete({
    where: {
      username: 'jrambo',
    },
  })

  const allUsers = await prisma.user.findMany({})
  console.dir(allUsers, { depth: null })
}

main()
  .catch((e) => {
    throw e
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
