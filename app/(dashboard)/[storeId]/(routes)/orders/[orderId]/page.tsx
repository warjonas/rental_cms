import React from 'react';

import { getProducts } from '@/actions/getProducts';
import { QuoteForm } from './components/quote-form';
import { ProductColumn } from './components/columns';
import { getQuoteItems } from '@/actions/getQuoteItems';
import { Customer, Product } from '@/types';
import { Quote } from '@/types';
import prismadb from '@/lib/prismadb';

const OrderPage = async ({
  params,
}: {
  params: { orderId: string; storeId: string };
}) => {
  const products = await getProducts(params.storeId);
  const customers = await prismadb.customer.findMany({
    where: {
      storeId: params.storeId,
    },
  });

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
    customer: items[0]?.quote?.customer.id,

    eventDate: items[0]?.quote?.eventDate,
    isPaid: items[0]?.quote?.isPaid,
    deliveryAddressLine1: items[0]?.quote?.deliveryAddressLine1,
    deliveryAddressLine2: items[0]?.quote?.deliveryAddressLine2,
    deliveryAddressSuburb: items[0]?.quote?.deliveryAddressSuburb,
    deliveryAddressCity: items[0]?.quote?.deliveryAddressCity,
    deliveryPhoneNumber: items[0]?.quote?.deliveryPhoneNumber,

    thirdPartyAddressLine1: items[0]?.quote?.thirdPartyAddressLine1,
    thirdPartyAddressLine2: items[0]?.quote?.thirdPartyAddressLine2,

    thirdPartyAddressCity: items[0]?.quote?.thirdPartyAddressCity,
    thirdPartyAddressSuburb: items[0]?.quote?.thirdPartyAddressSuburb,

    thirdPartyContactPerson: items[0]?.quote?.thirdPartyContactPerson,
    thirdPartyPhoneNumber: items[0]?.quote?.thirdPartyPhoneNumber,
    confirmationPayment: items[0]?.quote?.confirmationPayment,
    confirmationTerms: items[0]?.quote?.confirmationTerms,

    totalPrice: items[0]?.quote?.totalPrice.toNumber(),
  };

  return (
    <div className="flex-col w-full">
      <div className="flex-1 space-y-4 p-8 pt-6 w-full">
        <QuoteForm
          items={formattedItems}
          initialData={items.length !== 0 ? quote : null}
          products={formattedProducts}
          customers={customers}
        />
      </div>
    </div>
  );
};

export default OrderPage;
