'use client';

import { Button } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Plus } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import React from 'react';
import { ProductColumn, columns } from './columns';
import { Separator } from '@/components/ui/separator';
import { DataTable } from '@/components/ui/data-table';
import ApiList from '@/components/ui/api-list';

interface ProductClientProps {
  data: ProductColumn[];
  userType?: String;
}

export const ProductClient: React.FC<ProductClientProps> = ({
  data,
  userType,
}) => {
  const router = useRouter();
  const params = useParams();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Products (${data.length})`}
          description="Manage products for your store"
        />
        <Button onClick={() => router.push(`/${params.storeId}/products/new`)}>
          <Plus className="mr-2 h-4 w-4" />
          Add New
        </Button>
      </div>
      <Separator className="my-4" />
      <DataTable columns={columns} data={data} searchKey="name" />
      <Heading title="API" description="API Calls for products" />
      <Separator className="my-4" />

      {userType === 'MANAGER' || !userType ? null : (
        <ApiList entityName="products" entityIdName="productsId" />
      )}
    </>
  );
};
