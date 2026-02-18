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
import { FAQ } from '@/generated/prisma/client';
import axios from 'axios';
import { Trash } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import * as z from 'zod';

interface FaqFormProps {
  initialData: FAQ | null;
}

const formSchema = z.object({
  question: z.string().min(1),
  answer: z.string().min(1),
});

type FaqFormValues = z.infer<typeof formSchema>;

const FaqForm: React.FC<FaqFormProps> = ({ initialData }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const params = useParams();
  const router = useRouter();
  const origin = useOrigin();

  const title = initialData ? 'Edit FAQ' : 'Create FAQ';
  const description = initialData
    ? 'Make changes to existing FAQ.'
    : 'Add a new FAQ';
  const toastMessage = initialData
    ? 'Changes successfully applied.'
    : 'FAQ created successfully';
  const action = initialData ? 'Save changes' : 'Create FAQ';

  const form = useForm<FaqFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      question: '',
      answer: '',
    },
  });

  const onSubmit = async (data: FaqFormValues) => {
    try {
      setLoading(true);
      if (initialData) {
        await axios.patch(`/api/${params.storeId}/faq/${params.faqId}`, data);
      } else {
        await axios.post(`/api/${params.storeId}/faq`, data);
      }
      router.refresh();
      router.push(`/${params.storeId}/faq`);
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
      await axios.delete(`/api/${params.storeId}/faq/${params.faqId}`);
      router.refresh();
      router.push(`/${params.storeId}/faq`);
      toast.success('Faq has been deleted');
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
              name="question"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold">Question</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Question"
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
              name="answer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold">Answer</FormLabel>
                  <FormControl>
                    <Textarea
                      disabled={loading}
                      placeholder="Answer"
                      {...field}
                      maxLength={190}
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

export default FaqForm;
