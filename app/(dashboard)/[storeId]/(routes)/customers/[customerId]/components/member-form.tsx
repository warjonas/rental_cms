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
import { Customer, TeamMembers } from '@/generated/prisma/client';
import axios from 'axios';
import { Trash } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import * as z from 'zod';

interface MemberFormProps {
  initialData: Customer | null;
}

const MemberForm: React.FC<MemberFormProps> = ({ initialData }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const params = useParams();
  const router = useRouter();

  const title = 'Viewing customer Information';
  const description = 'View customer orders and personal details';

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
      </div>
      <Separator className="my-4" />

      <h1>
        Profile Details - {initialData?.firstName} {initialData?.lastName}
      </h1>

      <Separator className="my-5" />
    </>
  );
};

export default MemberForm;
