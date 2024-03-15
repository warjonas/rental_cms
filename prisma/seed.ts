import { PrismaClient, User } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();
async function main() {
  // const user = await prisma.customer.create({
  //   data: {
  //     id: '',
  //     firstName: '',
  //     lastName: ' ',
  //     emailAddress: '',
  //     store: {
  //       connect: {
  //         id: process.env.STORE_ID,
  //       },
  //     },
  //   },
  // });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
