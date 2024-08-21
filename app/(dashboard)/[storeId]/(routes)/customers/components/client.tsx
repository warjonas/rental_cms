'use client';

import { Button } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Plus } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import React from 'react';
import { MemberColumn, columns } from './columns';
import { Separator } from '@/components/ui/separator';
import { DataTable } from '@/components/ui/data-table';
import ApiList from '@/components/ui/api-list';

interface CustomerClientProps {
  data: MemberColumn[];
}

export const CustomerClient: React.FC<CustomerClientProps> = ({ data }) => {
  const router = useRouter();
  const params = useParams();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Customers (${data.length})`}
          description="Manage team members for your store"
        />
        <Button onClick={() => router.push(`/${params.storeId}/customers/new`)}>
          <Plus className="mr-2 h-4 w-4" />
          Add New
        </Button>
      </div>

      <Separator className="my-4" />
      <DataTable columns={columns} data={data} searchKey="email" />
      <Heading title="API" description="API Calls for members" />
      <Separator className="my-4" />

      <ApiList entityName="members" entityIdName="membersId" />
    </>
  );
};
