import { PrismaClient, User } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();
async function main() {
  const password = process.env.PASSWORD;

  if (password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        firstName: 'Warren',
        lastName: 'Jonas',
        email: 'admin@skywalkersoftware.tech',
        hashedPassword,
        role: 'ADMIN',
      },
    });
  }
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
