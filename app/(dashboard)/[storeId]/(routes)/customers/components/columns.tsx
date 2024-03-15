'use client';

import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import Image from 'next/image';

export type MemberColumn = {
  id: string;
  phone: string;
  firstName: string;
  lastName: string;
  email: string;
  registered: string;
};

export const columns: ColumnDef<MemberColumn>[] = [
  // {
  //   accessorKey: 'id',
  //   header: 'Member Code',
  // },

  {
    accessorKey: 'firstName',
    header: 'First Name',
  },
  {
    accessorKey: 'lastName',
    header: 'Last name',
  },
  {
    accessorKey: 'email',
    header: 'Email Address',
  },
  {
    accessorKey: 'phone',
    header: 'Phone No.',
  },
  {
    accessorKey: 'registered',
    header: 'Registered On',
  },

  // {
  //   id: 'actions',
  //   cell: ({ row }) => <CellAction data={row.original} />,
  // },
];
