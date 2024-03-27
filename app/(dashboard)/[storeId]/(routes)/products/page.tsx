import { format } from 'date-fns';
import { ProductClient } from './components/client';
import prismadb from '@/lib/prismadb';
import { ProductColumn } from './components/columns';
import { formatter } from '@/lib/utils';
import { getCurrentUser } from '@/actions/getCurrentUser';

const ProductsPage = async ({ params }: { params: { storeId: string } }) => {
  const products = await prismadb.product.findMany({
    where: {
      storeId: params.storeId,
    },
    include: {
      colour: true,
      category: true,
      size: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  const user = await getCurrentUser();

  const formattedProducts: ProductColumn[] = products.map((item) => ({
    id: item.id,
    name: item.name,
    isFeatured: item.isFeatured,
    isArchived: item.isArchived,
    price: formatter.format(item.price.toNumber()),
    category: item.category.name,
    size: item.size.name,
    colourId: item.colour.value,
    colour: item.colour.name,
    createdAt: format(item.createdAt, 'MMMM do, yyyy'),
    qty: item.qty.toNumber(),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductClient data={formattedProducts} userType={user?.role} />
      </div>
    </div>
  );
};

export default ProductsPage;
