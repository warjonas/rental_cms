'use client';

import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';

export type TestimonialColumn = {
  id: string;
  clientName: string;
  message: string;
};

export const columns: ColumnDef<TestimonialColumn>[] = [
  {
    accessorKey: 'clientName',
    header: 'Client Name',
  },
  {
    accessorKey: 'message',
    header: 'Message',
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
