import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { PrismaClient } from '../generated/prisma/client';

const adapter = new PrismaMariaDb(process.env.DATABASE_URL!);

declare global {
  var prisma: PrismaClient | undefined;
}

const prismadb = globalThis.prisma || new PrismaClient({ adapter });

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prismadb;

export default prismadb;
