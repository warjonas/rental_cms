import prismadb from '@/lib/prismadb';

export const getQuoteItems = async (orderId: string) => {
  const items = await prismadb.orderItem.findMany({
    where: {
      quoteId: orderId,
    },
    include: {
      product: {
        include: {
          colour: true,
        },
      },
      quote: {
        include: {
          customer: true,
        },
      },
    },
  });

  return items;
};
