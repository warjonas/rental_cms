import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import prismadb from '@/lib/prismadb';
import React from 'react';
import { CustomerOrderClient } from './components/client';
import { OrderColumn } from '../../../orders/components/columns';
import { getCustomer } from '@/actions/getCustomer';
import { formatter } from '@/lib/utils';
import Link from 'next/link';

const CustomerDetails = async ({
  params,
}: {
  params: { customerId: string; storeId: string };
}) => {
  const customer = await getCustomer(params.storeId, params.customerId);

  const formattedOrders = customer?.quotes.map((item) => ({
    id: item.id,
    address:
      item.deliveryAddressLine1 +
      ', ' +
      item.deliveryAddressSuburb +
      ', ' +
      item.deliveryAddressCity,
    phone: item.deliveryPhoneNumber,
    isPaid: item.isPaid,
    totalPrice: formatter.format(Number(item.totalPrice)),
    name: item.thirdPartyContactPerson,
    createdAt: item.createdAt,
    products: item.orderItems
      .map((orderItem) => orderItem.product.name)
      .join(', '),
  }));

  return (
    <div className=" flex flex-row w-full gap-x-5 p-4">
      {/**Customer Details Section */}
      <section className="flex flex-col w-1/4">
        <Heading
          title={'Customer Details'}
          description={'Personal Details of the Customer'}
        />
        <Separator className="my-2" />
        <div className="w-fill flex flex-col p-2 gap-y-2 border rounded-md  border-slate-200 h-full py-5">
          <h2 className="font-semibold text-lg">
            Full Name:{' '}
            <span className="font-normal">
              {customer?.firstName + ' ' + customer?.lastName}
            </span>
          </h2>
          <h2 className="font-semibold text-lg">
            ID Number: <span className="font-normal">{customer?.idNumber}</span>
          </h2>
          <h2 className="font-semibold text-lg">
            Email Address:{' '}
            <span className="font-normal">{customer?.emailAddress}</span>
          </h2>
          <h2 className="font-semibold text-lg">
            Phone No.:{' '}
            <span className="font-normal">{customer?.personalPhoneNumber}</span>
          </h2>
          <h2 className="font-semibold text-lg">
            Address Line 1:{' '}
            <span className="font-normal">
              {customer?.personalAddressLine1}
            </span>
          </h2>
          <h2 className="font-semibold text-lg">
            Address Line 2:{' '}
            <span className="font-normal">
              {customer?.personalAddressLine2}
            </span>
          </h2>
          <h2 className="font-semibold text-lg">
            Suburb:{' '}
            <span className="font-normal">
              {customer?.personalAddressSuburb}
            </span>
          </h2>
          <h2 className="font-semibold text-lg">
            City:{' '}
            <span className="font-normal">{customer?.personalAddressCity}</span>
          </h2>
        </div>
        <Link
          href={`/${params.storeId}/customers`}
          className="p-2 px-3 bg-primary text-background w-fit my-5 rounded-md shadow-sm hover:cursor-pointer hover:opacity-90 transition-all duration-200 ease-in-out"
        >
          Back
        </Link>
      </section>

      {/**Customer Orders */}
      <section className="flex flex-col w-3/4">
        <Heading
          title={"Customer's Orders"}
          description={'All the orders previously placed'}
        />
        <Separator className="my-2" />

        <div className="w-full flex flex-col">
          <CustomerOrderClient data={formattedOrders} />
        </div>
      </section>
    </div>
  );
};

export default CustomerDetails;
