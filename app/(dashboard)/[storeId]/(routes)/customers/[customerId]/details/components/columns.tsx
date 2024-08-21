'use client';

import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import Image from 'next/image';
import { OrderColumn } from '../../../../orders/components/columns';
import { formatter } from '@/lib/utils';
import { format } from 'date-fns';

export type MemberColumn = {
  id: string;
  phone: string;
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  registered: string;
};

export const columns: ColumnDef<OrderColumn>[] = [
  {
    accessorKey: 'id',
    header: 'Order No.',
  },
  {
    accessorKey: 'address',
    header: 'Address',
  },
  {
    accessorKey: 'phone',
    header: 'Phone',
  },

  {
    accessorKey: 'products',
    header: 'Products',
  },
  {
    accessorKey: 'totalPrice',
    header: 'Total Price',
  },

  {
    accessorKey: 'isPaid',
    header: 'Paid',
    cell: ({ row }) => <p>{row.original.isPaid === true ? 'Yes' : 'No'}</p>,
  },
  {
    accessorKey: 'createdAt',
    header: 'Date Placed',
    cell: ({ row }) => (
      <p>{format(new Date(row.original.createdAt), 'MMMM do, yyyy')}</p>
    ),
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
