import prismadb from '@/lib/prismadb';

export const getProducts = async (storeId: string) => {
  const products = await prismadb.product.findMany({
    where: {
      storeId: storeId,
    },
    include: {
      category: true,
      colour: true,
      size: true,
      images: true,
    },
    orderBy: {
      name: 'asc',
    },
  });

  return products;
};
