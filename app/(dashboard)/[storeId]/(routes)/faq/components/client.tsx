'use client';

import { Button } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Plus } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import React from 'react';
import { FaqColumn, columns } from './columns';
import { Separator } from '@/components/ui/separator';
import { DataTable } from '@/components/ui/data-table';
import ApiList from '@/components/ui/api-list';

interface FaqClientProps {
  data: FaqColumn[];
}

export const FaqClient: React.FC<FaqClientProps> = ({ data }) => {
  const router = useRouter();
  const params = useParams();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`FAQs (${data.length})`}
          description="Manage FAQs for your store"
        />
        <Button onClick={() => router.push(`/${params.storeId}/faq/new`)}>
          <Plus className="mr-2 h-4 w-4" />
          Add New
        </Button>
      </div>
      <Separator className="my-4" />
      <DataTable columns={columns} data={data} searchKey="label" />
      <Heading title="API" description="API Calls for FAQs" />
      <Separator className="my-4" />

      <ApiList entityName="faqs" entityIdName="faqId" />
    </>
  );
};
