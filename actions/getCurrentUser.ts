import prismadb from '@/lib/prismadb';

export const getCurrentUser = async (email: string) => {
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
