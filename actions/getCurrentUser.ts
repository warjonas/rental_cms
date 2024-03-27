import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prismadb from '@/lib/prismadb';
import { getServerSession } from 'next-auth';

export const getCurrentUser = async (email?: string) => {
  const session = await getServerSession(authOptions);

  if (!email && session?.user?.email) {
    email = session.user.email;
  }

  const user = await prismadb.user.findUnique({
    where: {
      email,
    },
    include: {
      stores: {
        include: { store: true },
      },
    },
  });

  return user;
};
