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
import { CalendarIcon, PlusIcon } from 'lucide-react';
import Currency from '@/components/ui/currency';
import { QuoteItemModal } from './quote-item-modal';

import { ProductColumn } from './columns';
import QuoteItem from './quote-item';
import { useParams, useSearchParams } from 'next/navigation';
import { Quote } from '@/types';
import { Product } from '@/types';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import qs from 'query-string';
import { cn } from '@/lib/utils';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';

export const revalidate = true;

interface QuoteFormProps {
  initialData: Quote | null;
  products: ProductColumn[];
  items: Product[];
}

const formSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  idNumber: z.string().max(13).min(13),
  emailAddress: z.string().email(),
  eventDate: z.date({ required_error: 'Event date is required.' }),
  phoneNumber: z.string().min(10).max(10),
  deliveryAddressLine1: z.string().min(1),
  deliveryAddressLine2: z.string().default(''),
  deliveryAddressCity: z.string().min(1),
  deliveryAddressSuburb: z.string().min(1),
  deliveryPhoneNumber: z.string().min(10),
  thirdPartyAddressLine1: z.string().min(1),
  thirdPartyAddressLine2: z.string().default(''),
  thirdPartyAddressCity: z.string().min(1),
  thirdPartyAddressSuburb: z.string().min(1),
  thirdPartyContactPerson: z.string().min(1),
  thirdPartyPhoneNumber: z.string().min(10),
  confirmationPayment: z.boolean(),
  confirmationTerms: z.boolean(),
  totalPrice: z.coerce.number().min(1),
  isPaid: z.boolean().default(false),
});

export const QuoteForm: React.FC<QuoteFormProps> = ({
  products,
  initialData,
  items,
}) => {
  const quoteItems = useQuoteStore();
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();

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
          firstName: initialData.customer.firstName,
          lastName: initialData.customer.lastName,
          phoneNumber: initialData.customer.phone,

          confirmationPayment: true,
          confirmationTerms: true,
          totalPrice,
        }
      : {
          isPaid: false,
          confirmationPayment: true,
          confirmationTerms: true,

          totalPrice,
        },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
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
      console.log({ error });
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
      <div className="w-full">
        <div className="space-y-4 py-2 pb-4">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-4"
            >
              <FormField
                control={form.control}
                name="eventDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date of Event:*</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={'outline'}
                            className={cn(
                              'w-full pl-3 text-left font-normal ',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            {field.value ? (
                              format(field.value, 'PPP')
                            ) : (
                              <span className="text-gray-400">Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-auto bg-primary-foreground p-0"
                        align="start"
                      >
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name:*</FormLabel>
                    <FormControl>
                      <Input placeholder="John" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name:*</FormLabel>
                    <FormControl>
                      <Input placeholder="Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="idNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ID Number:*</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="8504126122086"
                        {...field}
                        maxLength={13}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="emailAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address:*</FormLabel>
                    <FormControl>
                      <Input placeholder="johndoe@email.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number:*</FormLabel>
                    <FormControl>
                      <Input
                        disabled={loading}
                        placeholder="0123456789"
                        {...field}
                        maxLength={10}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="gap-5 flex flex-col md:flex-row w-full lg:gap-x-20 max-md:gap-y-10">
                <section className="gap-5 flex flex-col lg:w-1/2">
                  <h1 className={` text-primary text-2xl`}>
                    Delivery Information
                  </h1>
                  <FormField
                    control={form.control}
                    name="deliveryAddressLine1"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address Line 1:*</FormLabel>
                        <FormControl>
                          <Input placeholder="24 Joy Str." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="deliveryAddressLine2"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address Line 2 (optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="deliveryAddressSuburb"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Suburb:*</FormLabel>
                        <FormControl>
                          <Input placeholder="8504126122086" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="deliveryAddressCity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City:*</FormLabel>
                        <FormControl>
                          <Input placeholder="johndoe@email.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="deliveryPhoneNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number:*</FormLabel>
                        <FormControl>
                          <Input
                            disabled={loading}
                            placeholder="0123456789"
                            {...field}
                            maxLength={10}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </section>

                <section className="gap-5 flex flex-col max-md:mt-10 lg:w-1/2">
                  <article className="flex flex-row justify-start">
                    <h1 className={`text-2xl flex items-end justify-end w-fit`}>
                      Third Party Information{' '}
                    </h1>
                  </article>

                  <FormField
                    control={form.control}
                    name="thirdPartyAddressLine1"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address Line 1:*</FormLabel>
                        <FormControl>
                          <Input placeholder="24 Joy Str." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="thirdPartyAddressLine2"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address Line 2 (optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="thirdPartyAddressSuburb"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Suburb*</FormLabel>
                        <FormControl>
                          <Input placeholder="8504126122086" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="thirdPartyAddressCity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City:</FormLabel>
                        <FormControl>
                          <Input placeholder="johndoe@email.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="thirdPartyContactPerson"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contact Person Name:*</FormLabel>
                        <FormControl>
                          <Input
                            disabled={loading}
                            placeholder="0123456789"
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
                    name="thirdPartyPhoneNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number:*</FormLabel>
                        <FormControl>
                          <Input
                            disabled={loading}
                            placeholder="0123456789"
                            {...field}
                            maxLength={10}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </section>
              </div>
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
