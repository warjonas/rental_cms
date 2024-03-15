import { format } from 'date-fns';
import { CustomerClient } from './components/client';
import prismadb from '@/lib/prismadb';
import { MemberColumn } from './components/columns';

const CustomersPage = async ({ params }: { params: { storeId: string } }) => {
  const customers = await prismadb.customer.findMany({
    where: {
      storeId: params.storeId,
    },
  });

  const formattedMembers: MemberColumn[] = customers.map((item) => ({
    id: item.id,

    firstName: item.firstName,
    lastName: item.lastName,
    email: item.emailAddress,
    phone: item.personalPhoneNumber,
    registered: format(new Date(), 'dd/MM/yyyy'),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CustomerClient data={formattedMembers} />
      </div>
    </div>
  );
};

export default CustomersPage;
