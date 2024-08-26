'use client';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Heading } from '@/components/ui/heading';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect } from 'react';

import { signIn, auth } from '@/app/auth';
import { useSession } from 'next-auth/react';

import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import * as z from 'zod';
import axios from 'axios';

const formSchema = z.object({
  email: z.string().min(1),
  password: z.string().min(1),
});

type SignInFormValues = z.infer<typeof formSchema>;

const SignInForm = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const session = useSession();

  const form = useForm<SignInFormValues>({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    if (session?.status === 'authenticated') {
      router.push('/');
    }
  }, []);

  const onSubmit = async (data: SignInFormValues) => {
    try {
      setLoading(true);

      await axios.post('/api/auth/signIn', data);

      toast.success('Successfully Signed in!');
      router.push('/');
    } catch (error) {
      console.log('error', error);
      toast.error('Something went wrong!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white bg-opacity-10 text-primary h-[45vh] flex items-center justify-between flex-col p-10 rounded-md shadow-lg">
      <div className="flex items-center justify-between mb-10 text-center">
        <Heading
          title="Sign In"
          description="Sign In to start managing your store"
        />
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full flex h-[80%] flex-col"
        >
          <div className="flex flex-col gap-8">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="grid-cols-3">
                  <FormLabel className="font-bold">Email</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="Email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold">Password</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Password"
                      {...field}
                      type="password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Separator className="my-5" />
          <Button disabled={loading} className="ml-auto " type="submit">
            Log In
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default SignInForm;
