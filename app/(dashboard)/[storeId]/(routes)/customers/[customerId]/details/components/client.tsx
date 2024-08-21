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
import { OrderColumn } from '../../../../orders/components/columns';

interface CustomerOrderClientProps {
  data: any;
}

export const CustomerOrderClient: React.FC<CustomerOrderClientProps> = ({
  data,
}) => {
  const router = useRouter();
  const params = useParams();

  return (
    <>
      <DataTable columns={columns} data={data} searchKey="id" />
    </>
  );
};
