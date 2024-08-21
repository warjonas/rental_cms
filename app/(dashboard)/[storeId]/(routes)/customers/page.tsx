import { format } from 'date-fns';
import { CustomerClient } from './components/client';
import prismadb from '@/lib/prismadb';
import { MemberColumn } from './components/columns';
import { Customer } from '@/types';
import { Suspense } from 'react';
import Loading from './loading';

const CustomersPage = async ({ params }: { params: { storeId: string } }) => {
  const customers = await prismadb.customer.findMany({
    where: {
      storeId: params.storeId,
    },
    orderBy: {
      created: 'desc',
    },
  });

  const formattedMembers: MemberColumn[] = customers.map((item) => ({
    id: item.id,

    firstName: item.firstName,
    lastName: item.lastName,
    email: item.emailAddress,
    phone: item.personalPhoneNumber,
    address: item.personalAddressLine1 + ', ' + item.personalAddressSuburb,
    registered: item.created
      ? format(new Date(item.created), 'dd/MM/yyyy')
      : format(new Date(), 'dd/MM/yyyy'),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <Suspense fallback={<Loading />}>
          <CustomerClient data={formattedMembers} />
        </Suspense>
      </div>
    </div>
  );
};

export default CustomersPage;
