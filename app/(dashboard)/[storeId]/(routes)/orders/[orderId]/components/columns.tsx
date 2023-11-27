'use client';

import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import Image from 'next/image';
import { formatter } from '@/lib/utils';

export type ProductColumn = {
  id: string;
  image: string;
  name: string;
  price: number;
  category: string;
  colour: string;
  qty: number;
};

export const columns: ColumnDef<ProductColumn>[] = [
  {
    accessorKey: 'image',
    header: '',
    cell: ({ row }) => (
      <Image
        src={row.original.image}
        alt="product"
        width={1920}
        height={1080}
        className="h-20 w-20"
      />
    ),
  },
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'price',
    header: 'Price',
    cell: ({ row }) => <p>{formatter.format(row.original.price)}</p>,
  },
  {
    accessorKey: 'category',
    header: 'Category',
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
    header: 'Max Qty',
    cell: ({ row }) => <div>{row.original.qty}</div>,
  },

  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
