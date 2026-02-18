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
import { Textarea } from '@/components/ui/textarea';
import { useOrigin } from '@/hooks/use-origin';
import { zodResolver } from '@hookform/resolvers/zod';
import { Testimonial } from '@/generated/prisma/client';
import axios from 'axios';
import { Trash } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import * as z from 'zod';

interface TestimonialFormProps {
  initialData: Testimonial | null;
}

const formSchema = z.object({
  clientName: z.string().min(1),
  message: z.string().min(1),
});

type TestimonialFormValues = z.infer<typeof formSchema>;

const TestimonialForm: React.FC<TestimonialFormProps> = ({ initialData }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const params = useParams();
  const router = useRouter();
  const origin = useOrigin();

  const title = initialData ? 'Edit Testimonial' : 'Create Testimonial';
  const description = initialData
    ? 'Make changes to existing testimonial.'
    : 'Add a new Testimonial';
  const toastMessage = initialData
    ? 'Changes successfully applied.'
    : 'Testimonial created successfully';
  const action = initialData ? 'Save changes' : 'Create testimonial';

  const form = useForm<TestimonialFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      clientName: '',
      message: '',
    },
  });

  const onSubmit = async (data: TestimonialFormValues) => {
    try {
      setLoading(true);
      if (initialData) {
        await axios.patch(
          `/api/${params.storeId}/testimonials/${params.testimonialId}`,
          data,
        );
      } else {
        await axios.post(`/api/${params.storeId}/testimonials`, data);
      }
      router.refresh();
      router.push(`/${params.storeId}/testimonials`);
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
      await axios.delete(
        `/api/${params.storeId}/testimonials/${params.testimonialId}`,
      );
      router.refresh();
      router.push(`/${params.storeId}/testimonial`);
      toast.success('Testimonial has been deleted');
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
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="clientName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold">Clients Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Clients Name"
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
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold">Message</FormLabel>
                  <FormControl>
                    <Textarea
                      disabled={loading}
                      placeholder="Testimonial message"
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

export default TestimonialForm;
