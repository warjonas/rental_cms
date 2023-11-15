'use client';

import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';

export type ProductColumn = {
  id: string;
  name: string;
  isFeatured: boolean;
  isArchived: boolean;
  price: string;
  category: string;
  colour: string;
  createdAt: string;
  qty: number;
};

export const columns: ColumnDef<ProductColumn>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'price',
    header: 'Price',
  },
  {
    accessorKey: 'category',
    header: 'Category',
  },
  {
    accessorKey: 'size',
    header: 'Size',
  },
  {
    accessorKey: 'colour',
    header: 'Colour',
    cell: ({ row }) => (
      <div className="flex items-center gap-x-2">
        {row.original.colour}
        <div
          className="h-6 w-6 rounded-full border"
          style={{ backgroundColor: row.original.colour }}
        />
      </div>
    ),
  },
  {
    accessorKey: 'qty',
    header: 'Quantity',
    cell: ({ row }) => <div>{row.original.qty}</div>,
  },

  {
    accessorKey: 'isArchived',
    header: 'Archived',
    cell: ({ row }) => (
      <div>{row.original.isArchived === true ? <p>Yes</p> : <p>No</p>}</div>
    ),
  },
  {
    accessorKey: 'isFeatured',
    header: 'Featured',
    cell: ({ row }) => (
      <div>{row.original.isFeatured === true ? <p>Yes</p> : <p>No</p>}</div>
    ),
  },
  {
    accessorKey: 'createdAt',
    header: 'Date',
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
