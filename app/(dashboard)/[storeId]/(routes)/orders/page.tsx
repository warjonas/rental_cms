import { format } from 'date-fns';
import { OrderClient } from './components/client';
import prismadb from '@/lib/prismadb';
import { OrderColumn } from './components/columns';
import { formatter } from '@/lib/utils';
import { getOrders } from '@/actions/getOrders';
import { Order } from '@/generated/prisma/client';
import { getCurrentUser } from '@/actions/getCurrentUser';

export const revalidate = false;

const OrderPage = async ({ params }: { params: { storeId: string } }) => {
  const parameters = await params;
  const orders = await getOrders(parameters.storeId);
  const user = await getCurrentUser();

  // formatter.format(
  //     item.orderItems.reduce((total, item) => {
  //       return total + Number(item.product.price);
  //     }, 0)
  //   ),

  const formattedOrders: OrderColumn[] = orders.map((item) => ({
    id: item.id,
    name: item.customer.firstName + ' ' + item.customer.lastName,
    phone: item.customer.personalPhoneNumber,
    address: item.deliveryAddressLine1 + ', ' + item.deliveryAddressSuburb,
    isPaid: item.isPaid,
    products: item.orderItems
      .map((orderItem) => orderItem.product.name)
      .join(', '),
    totalPrice: formatter.format(Number(item.totalPrice)),
    createdAt: format(item.createdAt, 'MMMM do, yyyy'),
  }));
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <OrderClient data={formattedOrders} role={user?.role} />
      </div>
    </div>
  );
};

export default OrderPage;
