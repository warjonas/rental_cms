'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useEffect, useState } from 'react';
import { Modal } from '../ui/modal';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { ProductColumn } from '@/app/(dashboard)/[storeId]/(routes)/orders/[orderId]/components/columns';
import { Product } from '@/types';
import { formatter } from '@/lib/utils';
import useQuoteStore from '@/hooks/use-quote';
import toast from 'react-hot-toast';

interface QtyModalProps {
  isOpen: boolean;
  onClose: () => void;
  loading: boolean;
  product: ProductColumn;
}

const FormSchema = z.object({
  qty: z.coerce.number().min(1, {
    message: 'quantiy must be more than 0.',
  }),
});

export const QtyModal: React.FC<QtyModalProps> = ({
  isOpen,
  onClose,
  loading,
  product,
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const quote = useQuoteStore();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      qty: 1,
    },
  });

  const onConfirm = (data: z.infer<typeof FormSchema>) => {
    const item: Product = {
      id: product.id,
      name: product.name,
      qty: data.qty.toString(),
      totalPrice: data.qty * product.price,
      unitPrice: product.price,
      colour: product.colour,
    };

    try {
      quote.addItem(item, false);
      onClose();
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <Modal
      title="Quantity"
      description="Please indicate the amount of items to added for the item"
      isOpen={isOpen}
      onClose={onClose}
    >
      <h1 className="mb-5">
        Quantity for:{' '}
        <span className="uppercase">
          {product.name} {product.category}
        </span>
      </h1>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onConfirm)}
          className="w-2/3 space-y-6"
        >
          <FormField
            control={form.control}
            name="qty"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="10" {...field} max={product.qty} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex flex-row gap-2">
            <Button type="submit">Submit</Button>

            <Button disabled={loading} variant={'outline'} onClick={onClose}>
              Cancel
            </Button>
          </div>
        </form>
      </Form>
    </Modal>
  );
};
