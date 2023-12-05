'use client';

import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import Image from 'next/image';

export type MemberColumn = {
  id: string;
  image: string;
  firstName: string;
  lastName: string;
  position: string;
};

export const columns: ColumnDef<MemberColumn>[] = [
  {
    accessorKey: 'id',
    header: 'Member Code',
  },
  {
    accessorKey: 'image',
    header: 'Picture',
    cell: ({ row }) => (
      <Image
        src={row.original.image}
        alt="profile Image"
        width={1920}
        height={1080}
        className="h-32 w-32 rounded-full"
      />
    ),
  },

  {
    accessorKey: 'firstName',
    header: 'First Name',
  },
  {
    accessorKey: 'lastName',
    header: 'Last name',
  },
  {
    accessorKey: 'position',
    header: 'Position',
  },

  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
