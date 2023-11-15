import prismadb from '@/lib/prismadb';

export const getStoreUsers = async (storeId: string) => {
  const user = await prismadb.user.findMany({
    include: {
      stores: {
        where: {
          storeId,
        },
      },
    },
  });

  return user;
};
