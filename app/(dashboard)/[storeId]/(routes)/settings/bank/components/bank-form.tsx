'use client';

import { AlertModal } from '@/components/modals/alert-modal';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useOrigin } from '@/hooks/use-origin';
import { zodResolver } from '@hookform/resolvers/zod';
import { Billboard, StoreBank } from '@prisma/client';
import axios from 'axios';
import { Trash } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import * as z from 'zod';

interface BankFormProps {
  initialData: StoreBank | null;
}

const formSchema = z.object({
  name: z.string().min(1),
  accountNo: z.string().min(1),
  branchCode: z.string().min(1),
  accountType: z.string().min(1),
});

type BankFormValues = z.infer<typeof formSchema>;

const BankForm: React.FC<BankFormProps> = ({ initialData }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const params = useParams();
  const router = useRouter();
  const origin = useOrigin();

  const title = initialData ? 'Edit Banking Details' : 'Add Banking Details';
  const description = initialData
    ? 'Make changes to existing banking details.'
    : 'Add a new Banking Details';
  const toastMessage = initialData
    ? 'Changes successfully applied.'
    : 'Banking Details added successfully';
  const action = initialData ? 'Save changes' : 'Add Bank';

  const form = useForm<BankFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: '',
      accountNo: '',
      branchCode: '',
      accountType: '',
    },
  });

  const onSubmit = async (data: BankFormValues) => {
    try {
      setLoading(true);
      if (initialData) {
        await axios.patch(`/api/${params.storeId}/bank`, data);
      } else {
        await axios.post(`/api/${params.storeId}/bank`, data);
      }
      router.refresh();
      router.push(`/${params.storeId}/settings`);
      toast.success(toastMessage);
    } catch (error) {
      console.log(error);
      toast.error('Something went wrong!');
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(
        `/api/${params.storeId}/categories/${params.billboardId}`
      );
      router.refresh();
      router.push(`/${params.storeId}/settings`);
      toast.success('Banking details has been deleted');
    } catch (error) {
      toast.error(
        'Make sure that all stores using this bank have been deleted'
      );
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
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {initialData && (
          <Button
            variant={'destructive'}
            disabled={loading}
            size={'icon'}
            onClick={() => setOpen(true)}
          >
            <Trash />
          </Button>
        )}
      </div>
      <Separator className="my-4" />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full"
        >
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold">Bank Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Bank Name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="accountNo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold">Account No</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Account No."
                      {...field}
                      minLength={7}
                      maxLength={11}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="accountType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold">Account Type</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Account Type"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="branchCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold">Branch Code</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Branch Code"
                      {...field}
                      maxLength={6}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button disabled={loading} className="ml-auto" type="submit">
            {action}
          </Button>
        </form>
      </Form>
      <Separator className="my-5" />
    </>
  );
};

export default BankForm;
