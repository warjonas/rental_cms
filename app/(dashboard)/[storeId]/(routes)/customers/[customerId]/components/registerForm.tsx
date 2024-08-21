'use client';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import * as z from 'zod';
import { Playfair_Display, Playfair_Display_SC } from 'next/font/google';

import axios from 'axios';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { Customer } from '@prisma/client';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';

interface RegisterFormProps {
  initialData: Customer | null;
}

const formSchema = z.object({
  email: z.string().min(6, { message: 'Valid Email is required' }),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  idNumber: z.string().max(13).min(13),
  phoneNumber: z
    .string()
    .min(10, { message: 'Phone number is required' })
    .max(10),

  personalAddressLine1: z
    .string()
    .min(1, { message: 'Address Line 1 needs to be at least 8 characters' }),
  personalAddressLine2: z.string(),
  personalAddressCity: z.string().min(1, { message: 'City is required' }),
  personalAddressSuburb: z.string().min(1, { message: 'Suburb is required' }),
});

const RegisterForm = ({ initialData }: RegisterFormProps) => {
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const params = useParams();

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? { ...initialData, phoneNumber: initialData.personalPhoneNumber }
      : {
          firstName: '',
          lastName: '',
          email: '',
          idNumber: '',
          phoneNumber: '',
          personalAddressLine1: '',
          personalAddressLine2: '',
          personalAddressSuburb: '',
          personalAddressCity: '',
        },

    shouldFocusError: true,
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);

      if (initialData) {
        await axios.patch(`api/${params.storeId}/customer/`, data);
      } else {
        await axios.post(`/api/${params.storeId}/customer`, data);
      }
      router.refresh();
      router.push(`/${params.storeId}/customers`);
      toast.success('Customer Added Successfully!');
    } catch (error) {
      console.log(error);
      toast.error(
        'Something Went Wrong. Please check all fields and Try again!'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex">
      <section className="min-h-[40%] bg-white w-[80%] xl:w-1/2">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="gap-5 flex flex-col md:flex-col w-full lg:gap-x-20 max-md:gap-y-10">
              <div className="flex flex-col">
                <Heading
                  title={'Customer Details'}
                  description={'Complete customer details form'}
                />

                <Separator className="my-5" />
              </div>
              <div className="w-2/3 gap-x-5 flex flex-row">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name:*</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="John"
                          {...field}
                          className=" bg-input-secondary shadow-md"
                        />
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
                        <Input
                          placeholder="Doe"
                          {...field}
                          className="w-full  bg-input-secondary shadow-md"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
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
                        className="w-2/3 bg-input-secondary shadow-md"
                        minLength={13}
                        maxLength={13}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email:*</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="johndoe@gmail.com"
                        {...field}
                        className="w-2/3  bg-input-secondary shadow-md"
                        type="email"
                      />
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
                        minLength={10}
                        maxLength={10}
                        className="w-2/3 bg-input-secondary shadow-md"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="personalAddressLine1"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address Line 1:*</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="24 Joy Str."
                        {...field}
                        className="w-2/3 bg-input-secondary shadow-md"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="personalAddressLine2"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address Line 2 (optional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder=""
                        {...field}
                        className="w-2/3 bg-input-secondary shadow-md"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="personalAddressSuburb"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Suburb:*</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Bethelsdorp"
                        {...field}
                        className="w-2/3 bg-input-secondary shadow-md"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="personalAddressCity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City:*</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="PE, GQ"
                        {...field}
                        className="w-2/3 bg-input-secondary shadow-md"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-1/3 bg-primary self-end text-secondary mt-5"
                disabled={loading}
              >
                Submit
              </Button>
            </div>
          </form>
        </Form>
      </section>
    </div>
  );
};

export default RegisterForm;
