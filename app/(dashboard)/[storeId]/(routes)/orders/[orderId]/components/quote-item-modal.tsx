'use client';

import { Modal } from '@/components/ui/modal';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

import Image from 'next/image';
import { Product } from '@/types';
import { ProductClient } from './client';
import { ProductColumn } from './columns';

interface QuoteItemProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
  products: ProductColumn[];
}

// const formSchema = z.object({
//   productId: z.string().min(1),
//   qty: z.string().min(1),
// });

// type QuoteFormValues = z.infer<typeof formSchema>;

export const QuoteItemModal: React.FC<QuoteItemProps> = ({
  isOpen,
  onConfirm,
  loading,
  onClose,
  products,
}) => {
  const [isMounted, setIsMounted] = useState(false);

  // const filteredProducts = products.filter

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <Modal
      title="Select Item"
      description="Search for item to add to quotation"
      isOpen={isOpen}
      onClose={onClose}
    >
      <div>
        <div className="space-y-4 py-2 pb-4">
          <div className="w-full">
            <ProductClient data={products} />
          </div>
        </div>
      </div>
    </Modal>
  );
};
