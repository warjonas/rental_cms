'use client';

import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Modal } from '@/components/ui/modal';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Checkbox } from '@/components/ui/checkbox';
import useQuoteStore from '@/hooks/use-quote';
import NoResults from '@/components/ui/no-results';
import { PlusIcon } from 'lucide-react';
import Currency from '@/components/ui/currency';
import { QuoteItemModal } from './quote-item-modal';
import { useParams } from 'next/navigation';
import { getProducts } from '@/actions/getProducts';
import { Product } from '@/types';

const formSchema = z.object({
  name: z.string().min(1),
  phone: z.string().min(1),
  address: z.string().min(1),
  isPaid: z.boolean(),
  dueBy: z.string().min(1),
});

export const QuoteForm = ({ products }: { products: Product[] }) => {
  const cart = useQuoteStore();

  const params = useParams();

  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const totalPrice = cart.items.reduce((total, item) => {
    return total + Number(item.price);
  }, 0);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      phone: '',
      address: '',
      isPaid: false,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);

      const response = await axios.post('/api/stores', values);

      window.location.assign(`/${response.data.id}`);
    } catch (error) {
      toast.error('Something Went Wrong!');
    } finally {
      setLoading(false);
    }
  };

  const addItem = async () => {};

  return (
    <div className="w-1/2">
      <QuoteItemModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={addItem}
        loading={loading}
        products={products}
      />
      <div>
        <div className="space-y-4 py-2 pb-4">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-4"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Customer Name:</FormLabel>
                    <FormControl>
                      <Input
                        disabled={loading}
                        placeholder="Customer name, e.g John Doe"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number:</FormLabel>
                    <FormControl>
                      <Input
                        disabled={loading}
                        placeholder="Customer phone number, e.g 0123456789"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Customer Address:</FormLabel>
                    <FormControl>
                      <Input
                        disabled={loading}
                        placeholder="Customer Address, e.g 31 Normsville Dr"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex flex-col my-5">
                <div className="flex justify-between">
                  <h1>Items:</h1>
                  <PlusIcon onClick={() => setOpen(true)} />
                </div>

                <div className="flex flex-row items-start space-x-3 space-y-0 mt-5 rounded-md border p-4">
                  {cart.items.length === 0 && (
                    <NoResults message="No items added to quote" />
                  )}
                  <ul>
                    {cart.items.map((item) => (
                      <p>{item.name}</p>
                    ))}
                  </ul>
                </div>
              </div>
              <FormField
                control={form.control}
                name="isPaid"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 mt-5 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={() => field.onChange(!field.value)}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Paid</FormLabel>
                      <FormDescription>
                        This will allow the order to be added to the total
                        sales/orders.
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
              <div className="mt-6 space-y-4 mb-10">
                <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                  <div className="text-base font-medium text-secondary-foreground">
                    Total
                  </div>
                  <Currency value={totalPrice} />
                </div>
              </div>

              <div className="pt-6 space-x-2 flex items-center justify-end w-full">
                <Button disabled={loading} type="submit">
                  Continue
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};
