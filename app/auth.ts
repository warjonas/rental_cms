import NextAuth from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';

import CredentialsProvider from 'next-auth/providers/credentials';

import prismadb from '@/lib/prismadb';
import bcrypt from 'bcryptjs';

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prismadb),
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: {
          label: 'Email',
          type: 'text',
          placeholder: 'jsmith@email.com',
        },
        password: { label: 'Password', type: 'password' },
        username: {
          label: 'Username',
          type: 'text',
          placeholder: 'smithyj128',
        },
      },

      async authorize(credentials: any) {
        const { password, email }: { email: string; password: string } =
          credentials;

        if (!email || !password) {
          throw new Error('Missing fields');
        }

        const user = await prismadb.user.findUnique({
          where: {
            email,
          },
        });

        if (!user || !user?.hashedPassword) {
          throw new Error('User does not exist.');
        }

        const match = await bcrypt.compare(password, user.hashedPassword);

        if (!match) {
          throw new Error(
            'Invalid Credentials. Please check password and email.'
          );
        }

        return user;
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
  },
  debug: process.env.NODE_ENV === 'development',
  pages: {
    signIn: '/sign-in',
  },
});
