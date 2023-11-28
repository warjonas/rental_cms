'use client';

import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

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
import { useEffect, useState } from 'react';

import { toast } from 'react-hot-toast';
import { Checkbox } from '@/components/ui/checkbox';
import useQuoteStore from '@/hooks/use-quote';
import NoResults from '@/components/ui/no-results';
import { PlusIcon } from 'lucide-react';
import Currency from '@/components/ui/currency';
import { QuoteItemModal } from './quote-item-modal';

import { ProductColumn } from './columns';
import QuoteItem from './quote-item';
import { useParams } from 'next/navigation';
import { Quote } from '@/types';
import { Product } from '@/types';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export const revalidate = true;

interface QuoteFormProps {
  initialData: Quote | null;
  products: ProductColumn[];
  items: Product[];
}

const formSchema = z.object({
  name: z.string().min(1),
  phone: z.string().min(1).max(10),
  address: z.string().min(1),
  isPaid: z.boolean().default(false).optional(),
  dueBy: z.string().min(1),
  totalPrice: z.coerce.number().min(1),
});

export const QuoteForm: React.FC<QuoteFormProps> = ({
  products,
  initialData,
  items,
}) => {
  const quoteItems = useQuoteStore();
  const params = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [open, setOpen] = useState(false);

  const totalPrice = quoteItems.items.reduce((total, item) => {
    return total + Number(item.totalPrice);
  }, 0);

  useEffect(() => {
    quoteItems.removeAll();
    setIsMounted(true);

    if (initialData) {
      items.map((item) => {
        quoteItems.addItem(item, true);
      });
    }
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),

    defaultValues: initialData
      ? {
          ...initialData,
          name: initialData?.Name,
          totalPrice,
          dueBy: Date.now().toString(),
        }
      : {
          name: '',
          phone: '',
          address: '',
          isPaid: false,
          dueBy: Date.now().toString(),
          totalPrice,
        },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log('submit');
    try {
      setLoading(true);

      let response;
      values.totalPrice = totalPrice;

      if (initialData === null) {
        response = await axios.post(`/api/${params.storeId}/checkout`, {
          values,
          products: quoteItems,
        });
      } else {
        response = await axios.patch(
          `/api/${params.storeId}/checkout/${params.orderId}`,
          {
            values,
            products: quoteItems,
          }
        );
      }

      router.refresh();

      router.push(`/${params.storeId}/orders`);
    } catch (error) {
      toast.error('Something Went Wrong!');
    } finally {
      setLoading(false);
    }
  };

  const onCancel = () => {
    quoteItems.removeAll();
    router.back();
  };

  const addItem = async () => {};

  if (!isMounted) {
    return null;
  }

  return (
    <div className="w-full xl:w-2/3">
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
                        maxLength={10}
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
                  {quoteItems.items.length === 0 && (
                    <NoResults message="No items added to quote" />
                  )}
                  <ul className="w-full flex flex-col gap-4">
                    {quoteItems.items.map((item) => (
                      <QuoteItem product={item} key={item.id} />
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
                <Button
                  onClick={() => onCancel()}
                  type="button"
                  className="bg-red-800 text-primary hover:bg-red-900 border hover:border-red-900"
                >
                  Cancel
                </Button>

                <Button
                  disabled={loading || quoteItems.items.length === 0}
                  type="submit"
                >
                  {!initialData ? 'Continue' : 'Update'}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};
