import prismadb from '@/lib/prismadb';

export const getQuoteItems = async (quoteId: string) => {
  const items = await prismadb.quoteItem.findMany({
    where: {
      quoteId: quoteId,
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
