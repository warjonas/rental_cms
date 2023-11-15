import prismadb from '@/lib/prismadb';
import React from 'react';

import { getProducts } from '@/actions/getProducts';
import { QuoteForm } from './components/quote-form';
import { Product } from '@/types';

const QuotePage = async ({
  params,
}: {
  params: { orderId: string; storeId: string };
}) => {
  const products = await getProducts(params.storeId);

  const formattedProducts: Product[] = products.map((item) => ({
    id: item.id,
    name: item.name,
    images: item.images,
    colour: item.colour.id,
    price: item.price.toString(),
    qty: item.qty.toString(),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <QuoteForm products={formattedProducts} />
      </div>
    </div>
  );
};

export default QuotePage;
