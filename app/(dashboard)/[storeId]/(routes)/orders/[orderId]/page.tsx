import React from 'react';

import { getProducts } from '@/actions/getProducts';
import { QuoteForm } from './components/quote-form';
import { ProductColumn } from './components/columns';
import { getQuoteItems } from '@/actions/getQuoteItems';
import { Product } from '@/types';
import { Quote } from '@/types';

const QuotePage = async ({
  params,
}: {
  params: { orderId: string; storeId: string };
}) => {
  const products = await getProducts(params.storeId);

  const formattedProducts: ProductColumn[] = products.map((item) => ({
    id: item.id,
    name: item.name,
    category: item.category.name,
    image: item.images[0].url,
    colour: item.colour.name,
    price: item.price.toNumber(),
    qty: item.qty.toNumber(),
  }));

  const items = await getQuoteItems(params.orderId);

  const formattedItems: Product[] = items.map((item) => ({
    id: item.product.id,
    name: item.product.name,
    colour: item.product.colour.name,
    qty: item.qty.toString(),
    unitPrice: item.unitPrice.toNumber(),
    totalPrice: item.qty.toNumber() * item.unitPrice.toNumber(),
  }));

  const quote: Quote = {
    id: items[0]?.quote?.id,
    phone: items[0]?.quote?.phone,
    Name: items[0]?.quote?.Name,
    isPaid: items[0]?.quote?.isPaid,
    address: items[0]?.quote?.address,
    totalPrice: items[0]?.quote?.totalPrice.toNumber(),
  };

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <QuoteForm
          items={formattedItems}
          initialData={quote}
          products={formattedProducts}
        />
      </div>
    </div>
  );
};

export default QuotePage;
