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
import { CalendarIcon, Check, ChevronsUpDown, PlusIcon } from 'lucide-react';
import Currency from '@/components/ui/currency';
import { QuoteItemModal } from './quote-item-modal';

import { ProductColumn } from './columns';
import QuoteItem from './quote-item';
import { useParams, useSearchParams } from 'next/navigation';
import { Quote } from '@/types';
import { Product } from '@/types';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { cn } from '@/lib/utils';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Customer } from '@prisma/client';

interface QuoteFormProps {
  initialData: Quote | null;
  products: ProductColumn[];
  items: Product[];
  customers: Customer[];
}

const formSchema = z.object({
  eventDate: z.date({ required_error: 'Event date is required.' }),
  customer: z.string().min(1),
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
  customers,
}) => {
  const quoteItems = useQuoteStore();
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [loading, setLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(false);

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

          confirmationPayment: true,
          confirmationTerms: true,
          totalPrice,
        }
      : {
          isPaid: false,
          confirmationPayment: true,
          confirmationTerms: true,
          customer: '',
          deliveryAddressLine1: '',
          deliveryAddressLine2: '',
          deliveryAddressCity: '',
          deliveryAddressSuburb: '',
          deliveryPhoneNumber: '',
          thirdPartyAddressLine1: '',
          thirdPartyAddressLine2: '',

          thirdPartyAddressCity: '',
          thirdPartyAddressSuburb: '',
          thirdPartyContactPerson: '',
          thirdPartyPhoneNumber: '',

          totalPrice,
        },
  });

  const { watch, formState } = form;

  let errMessage = 'Something went wrong!';

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);

      if (quoteItems.items.length === 0) {
        errMessage = 'No items selected!';
      }

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

      toast.error(errMessage);
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
                name="customer"
                render={({ field }) => (
                  <FormItem className="flex flex-col w-full">
                    <FormLabel>Select a customer</FormLabel>
                    <Popover open={openDropdown} onOpenChange={setOpenDropdown}>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            className={cn(
                              'w-full justify-between',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            {field.value
                              ? customers.find(
                                  (customer) => customer.id === field.value
                                )?.firstName +
                                ' ' +
                                customers.find(
                                  (customer) => customer.id === field.value
                                )?.lastName +
                                ' - ' +
                                customers.find(
                                  (customer) => customer.id === field.value
                                )?.personalAddressLine1
                              : 'Select customer'}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0">
                        <Command>
                          <CommandInput placeholder="Search customer..." />
                          <CommandList>
                            <CommandEmpty>No customer found.</CommandEmpty>
                            <CommandGroup>
                              {customers.map((customer: Customer) => (
                                <CommandItem
                                  value={customer.id}
                                  key={customer.id}
                                  onSelect={() => {
                                    form.setValue('customer', customer.id);
                                    setOpenDropdown(false);
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      'mr-2 h-4 w-4',
                                      customer.id === field.value
                                        ? 'opacity-100'
                                        : 'opacity-0'
                                    )}
                                  />
                                  {customer.firstName + ' ' + customer.lastName}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormDescription>
                      The customer whom the order is being placed for.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
                          <Input placeholder="Bethelsdorp" {...field} />
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
                          <Input placeholder="PE" {...field} />
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
                          <Input placeholder="Malabar" {...field} />
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
                          <Input placeholder="PE" {...field} />
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
                            placeholder="Louis"
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
                  className="bg-red-800 text-background hover:bg-red-900 border hover:border-red-900"
                >
                  Cancel
                </Button>

                <Button disabled={loading} type="submit">
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
