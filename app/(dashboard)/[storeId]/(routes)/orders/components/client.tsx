'use client';

import { Button } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Plus } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import React from 'react';
import { OrderColumn, columns } from './columns';
import { Separator } from '@/components/ui/separator';
import { DataTable } from '@/components/ui/data-table';
import ApiList from '@/components/ui/api-list';

interface OrderClientProps {
  data: OrderColumn[];
  role: string | undefined;
}

export const OrderClient: React.FC<OrderClientProps> = ({ data, role }) => {
  const router = useRouter();
  const params = useParams();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Order (${data.length})`}
          description="Manage orders for your store"
        />
        <Button onClick={() => router.push(`/${params.storeId}/orders/new`)}>
          <Plus className="mr-2 h-4 w-4" />
          New Quotation
        </Button>
      </div>
      <Separator className="my-4" />
      <DataTable columns={columns} data={data} searchKey="id" />
      <Heading title="API" description="API Calls for orders" />
      <Separator className="my-4" />

      {role == 'ADMIN' && (
        <ApiList entityName="orders" entityIdName="orderId" />
      )}
    </>
  );
};
