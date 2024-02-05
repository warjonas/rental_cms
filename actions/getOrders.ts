import prismadb from '@/lib/prismadb';

export const revalidate = true;

export const getOrders = async (storeId: string) => {
  const orders = await prismadb.order.findMany({
    where: {
      storeId: storeId,
    },
    include: {
      customer: true,
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
