'use client';

import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';

export type FaqColumn = {
  id: string;
  question: string;
  answer: string;
};

export const columns: ColumnDef<FaqColumn>[] = [
  {
    accessorKey: 'question',
    header: 'Question',
  },
  {
    accessorKey: 'answer',
    header: 'Answer',
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
