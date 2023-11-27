import prismadb from '@/lib/prismadb';

export const revalidate = true;

export const getOrders = async (storeId: string) => {
  const orders = await prismadb.quote.findMany({
    where: {
      storeId: storeId,
    },
    include: {
      orderItems: {
        include: {
          product: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return orders;
};
