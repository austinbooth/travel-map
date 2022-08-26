import { PrismaClient, Prisma } from '@prisma/client'

const prisma = new PrismaClient()

const users: Prisma.UserCreateInput[] = [
  {
    name: 'Arthur',
    email: 'arthur@test.com',
  }
]

const createUserInDB = async (user: Prisma.UserCreateInput) => {
  console.log(`Creating user with name: ${user.name}`)
  const newUser = await prisma.user.create({
    data: user,
  })
  console.log(`Created user with id: ${newUser.id} and name: ${newUser.name}`)
}

const main = async () => {
  for (const u of users) {
    await createUserInDB(u)
  }
}
main()
