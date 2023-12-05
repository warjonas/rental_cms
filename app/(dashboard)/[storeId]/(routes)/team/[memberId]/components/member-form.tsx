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
import ImageUpload from '@/components/ui/image-upload';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { useOrigin } from '@/hooks/use-origin';
import { zodResolver } from '@hookform/resolvers/zod';
import { TeamMembers } from '@prisma/client';
import axios from 'axios';
import { Trash } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import * as z from 'zod';

interface MemberFormProps {
  initialData: TeamMembers | null;
}

const formSchema = z.object({
  phone: z.string().min(1),

  firstName: z.string().min(1),
  lastName: z.string().min(1),
  position: z.string().min(1),

  imageUrl: z.string().min(1),
});

type MemberFormValues = z.infer<typeof formSchema>;

const MemberForm: React.FC<MemberFormProps> = ({ initialData }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const params = useParams();
  const router = useRouter();

  const title = initialData ? 'Edit Member' : 'Create Member';
  const description = initialData
    ? 'Make changes to existing member.'
    : 'Add a new Member';
  const toastMessage = initialData
    ? 'Changes successfully applied.'
    : 'Member created successfully';
  const action = initialData ? 'Save changes' : 'Submit';

  const form = useForm<MemberFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      phone: '',
      firstName: '',
      lastName: '',
      position: '',

      imageUrl: '',
    },
  });

  const onSubmit = async (data: MemberFormValues) => {
    try {
      setLoading(true);
      if (initialData) {
        await axios.patch(
          `/api/${params.storeId}/team/${params.memberId}`,
          data
        );
      } else {
        await axios.post(`/api/${params.storeId}/team`, data);
      }
      router.refresh();
      router.push(`/${params.storeId}/team`);
      toast.success(toastMessage);
    } catch (error) {
      toast.error('Something went wrong!');
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/${params.storeId}/team/${params.memberId}`);
      router.refresh();
      router.push(`/${params.storeId}/team`);
      toast.success('Member has been deleted');
    } catch (error) {
      toast.error('Make sure that all categories have been deleted');
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
          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold">Profile Image</FormLabel>
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
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold">Phone No.</FormLabel>
                  <FormControl>
                    <Input
                      disabled={initialData !== null}
                      placeholder="Phone No."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold">First Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="First Name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold">Last Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Last name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="position"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold">Position</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Member Position"
                      {...field}
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

export default MemberForm;
