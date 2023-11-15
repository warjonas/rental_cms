'use client';

import { Button } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Plus } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import React from 'react';
import { ColourColumn, columns } from './columns';
import { Separator } from '@/components/ui/separator';
import { DataTable } from '@/components/ui/data-table';
import ApiList from '@/components/ui/api-list';

interface ColourClientProps {
  data: ColourColumn[];
}

export const ColourClient: React.FC<ColourClientProps> = ({ data }) => {
  const router = useRouter();
  const params = useParams();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Colours (${data.length})`}
          description="Manage colours for your products"
        />
        <Button onClick={() => router.push(`/${params.storeId}/colours/new`)}>
          <Plus className="mr-2 h-4 w-4" />
          Add New
        </Button>
      </div>
      <Separator className="my-4" />
      <DataTable columns={columns} data={data} searchKey="label" />
      <Heading title="API" description="API Calls for colours" />
      <Separator className="my-4" />

      <ApiList entityName="colours" entityIdName="colourId" />
    </>
  );
};
