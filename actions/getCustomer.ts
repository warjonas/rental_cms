import prismadb from '@/lib/prismadb';

export const revalidate = true;

export const getCustomer = async (storeId: string, customerId: string) => {
  const customer = await prismadb.customer.findUnique({
    where: {
      id: customerId,
      storeId: storeId,
    },
    include: {
      quotes: {
        include: {
          orderItems: {
            include: {
              product: true,
            },
          },
        },
      },
    },
  });

  return customer;
};
