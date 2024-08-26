import { auth } from '@/app/auth';
import prismadb from '@/lib/prismadb';

export const getCurrentUser = async (email?: string) => {
  const session = await auth();

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
