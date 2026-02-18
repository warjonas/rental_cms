'use client';

import { AlertModal } from '@/components/modals/alert-modal';
import { ApiAlert } from '@/components/ui/api-alert';
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
import { useOrigin } from '@/hooks/use-origin';
import { zodResolver } from '@hookform/resolvers/zod';
import { Store, StoreBank } from '@/generated/prisma/client';
import axios from 'axios';
import { BanknoteIcon, PencilIcon, Trash } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import * as z from 'zod';
import BankingDetails from './banking-details';
import ImageUpload from '@/components/ui/image-upload';

interface SettingsFormProps {
  initialData: Store;
  role: string | undefined;
  bank: any;
}

const formSchema = z.object({
  name: z.string().min(1),
  logoUrl: z.string().min(1),
});

type SettingsFormValues = z.infer<typeof formSchema>;

const SettingsForm: React.FC<SettingsFormProps> = ({
  initialData,
  role,
  bank,
}) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const params = useParams();
  const router = useRouter();
  const origin = useOrigin();
  console.log(initialData);

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  });

  const onSubmit = async (data: SettingsFormValues) => {
    console.log(data);

    try {
      setLoading(true);
      await axios.patch(`/api/stores/${params.storeId}`, data);
      router.refresh();
      toast.success('Store Updated!');
    } catch (error) {
      toast.error('Something went wrong!');
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/stores/${params.storeId}`);
      router.refresh();
      router.push('/');
      toast.success('Store has been deleted');
    } catch (error) {
      toast.error(
        'Make sure that all products and categories have been deleted',
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
        <Heading title="Settings" description="Manage Store Preferences" />
        <Button
          variant={'destructive'}
          disabled={loading}
          size={'icon'}
          onClick={() => setOpen(true)}
        >
          <Trash />
        </Button>
      </div>
      <Separator className="my-4" />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full"
        >
          <FormField
            control={form.control}
            name="logoUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold">Business Logo</FormLabel>
                <FormControl>
                  <ImageUpload
                    value={field.value ? [field.value] : []}
                    disabled={loading}
                    onChange={(url) => field.onChange(url)}
                    onRemove={() => field.onChange('')}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Store name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button disabled={loading} className="ml-auto" type="submit">
            Save Changes
          </Button>
        </form>
      </Form>

      {role === 'ADMIN' && (
        <>
          <Separator className="my-5" />
          <ApiAlert
            title="NEXT_PUBLIC_API_URL"
            description={`${origin}/api/${params.storeId}`}
            variant="public"
          />
        </>
      )}
      <Separator className="my-5" />
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-10">
          <Heading
            title="Banking Details"
            description="Manage your store's banking details"
          />

          {initialData.bankId === null ? (
            <Button
              variant={'default'}
              disabled={loading}
              size={'icon'}
              onClick={() => router.push(`/${params.storeId}/settings/bank`)}
              className="w-fit p-5 gap-2"
            >
              Add Bank <BanknoteIcon className="h-8 w-8" />
            </Button>
          ) : (
            <Button
              variant={'default'}
              disabled={loading}
              size={'icon'}
              onClick={() => router.push(`/${params.storeId}/settings/bank`)}
              className="w-fit p-5 gap-2"
            >
              Edit <PencilIcon className="h-5 w-5" />
            </Button>
          )}
        </div>
        <Separator className="my-1" />

        {initialData.bankId !== null ? (
          <BankingDetails data={bank} />
        ) : (
          <h1> You currently have no banking details for your store</h1>
        )}
      </div>
    </>
  );
};

export default SettingsForm;
