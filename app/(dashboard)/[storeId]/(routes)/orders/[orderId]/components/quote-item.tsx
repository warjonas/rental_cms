'use client';

import { AlertModal } from '@/components/modals/alert-modal';
import { Button } from '@/components/ui/button';
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import useQuoteStore from '@/hooks/use-quote';
import { formatter } from '@/lib/utils';
import { Product } from '@/types';
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from '@radix-ui/react-dropdown-menu';
import axios from 'axios';
import { Edit, MoreHorizontal, Trash } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import React, { useState } from 'react';
import toast from 'react-hot-toast';

interface QuoteItemProps {
  product: Product;
}

const QuoteItem: React.FC<QuoteItemProps> = ({ product }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const params = useParams();
  const router = useRouter();
  const quote = useQuoteStore();

  const onDelete = async () => {
    try {
      setLoading(true);
      quote.removeItem(product.id);
    } catch (error) {
      toast.error('Something went wrong. Try again.');
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };
  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      />
      <div className="grid grid-cols-6 justify-between">
        <h1 className="">{product.name}</h1>
        <h1>
          <b>Color: </b>
          {product.colour}
        </h1>
        <h1>
          <b>Unit Price: </b>
          {formatter.format(product.unitPrice)}
        </h1>
        <h1>
          <b>Qty: </b>
          {product.qty}
        </h1>
        <h1>
          <b>Total: </b>
          {formatter.format(product.totalPrice)}
        </h1>
        <div className="flex justify-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open Menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => setOpen(true)}>
                <Edit className="mr-2 h-4 w-4" />
                Update Quantiy
              </DropdownMenuItem>

              <DropdownMenuItem onClick={() => setOpen(true)}>
                <Trash className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </>
  );
};

export default QuoteItem;
