'use client';

import { Button } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Plus } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import React from 'react';
import { TestimonialColumn, columns } from './columns';
import { Separator } from '@/components/ui/separator';
import { DataTable } from '@/components/ui/data-table';
import ApiList from '@/components/ui/api-list';

interface TestimonialClientProps {
  data: TestimonialColumn[];
}

export const TestimonialClient: React.FC<TestimonialClientProps> = ({
  data,
}) => {
  const router = useRouter();
  const params = useParams();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Client Testimonials (${data.length})`}
          description="Manage testimonials for your store"
        />
        <Button
          onClick={() => router.push(`/${params.storeId}/testimonials/new`)}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add New
        </Button>
      </div>
      <Separator className="my-4" />
      <DataTable columns={columns} data={data} searchKey="clientName" />
      <Heading title="API" description="API Calls for testimonials" />
      <Separator className="my-4" />

      <ApiList entityName="testimonials" entityIdName="testimonialId" />
    </>
  );
};
