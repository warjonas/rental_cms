'use client';

import { useState } from 'react';
import { Copy, Edit, MoreHorizontal, PlusCircle, Trash } from 'lucide-react';
import toast from 'react-hot-toast';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';

import { ProductColumn } from './columns';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { AlertModal } from '@/components/modals/alert-modal';
import { QtyModal } from '@/components/modals/qty-modal';

interface CellActionProps {
  data: ProductColumn;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const params = useParams();
  const router = useRouter();

  return (
    <>
      <QtyModal
        isOpen={open}
        onClose={() => setOpen(false)}
        loading={loading}
        product={data}
      />
      <div
        className="flex flex-row items-center gap-1"
        onClick={() => setOpen(true)}
      >
        <h1>Add</h1>
        <PlusCircle />
      </div>
    </>
  );
};
