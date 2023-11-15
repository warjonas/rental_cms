'use client';

import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { useStoreModal } from '@/hooks/use-store-modal';
import { Modal } from '@/components/ui/modal';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Image from 'next/image';
import { Product } from '@/types';

interface QuoteItemProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
  products: Product[];
}

// const formSchema = z.object({
//   productId: z.string().min(1),
//   qty: z.string().min(1),
// });

// type QuoteFormValues = z.infer<typeof formSchema>;

export const QuoteItemModal: React.FC<QuoteItemProps> = ({
  isOpen,
  onConfirm,
  loading,
  onClose,
  products,
}) => {
  const [isMounted, setIsMounted] = useState(false);

  // const filteredProducts = products.filter

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  // const form = useForm<QuoteFormValues>({
  //   resolver: zodResolver(formSchema),
  // });

  return (
    <Modal
      title="Select Item"
      description="Search for item to add to quotation"
      isOpen={isOpen}
      onClose={onClose}
    >
      <div>
        <div className="space-y-4 py-2 pb-4">
          <div className="w-full">
            <Select>
              <SelectTrigger className="w-full h-fit">
                <SelectValue placeholder="Select a product" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Product</SelectLabel>
                  {products.map((product) => (
                    <SelectItem value={product.id} className="w-full">
                      <div className="flex flex-row gap-2">
                        <Image
                          src={product.images[0].url}
                          alt="product"
                          width={1920}
                          height={1080}
                          className="w-20 h-20"
                        />
                        <h1 className="text-xl">{product.name}</h1>
                      </div>
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Input type="number" placeholder="20" id="quantity" />
          </div>
        </div>
      </div>
      <Button>Add Item</Button>
    </Modal>
  );
};

// <Form {...form}>
//   <form onSubmit={form.handleSubmit(onConfirm)} className="space-y-8 w-full">
//     <div className="grid grid-cols-3 gap-8">
//       <FormField
//         control={form.control}
//         name="qty"
//         render={({ field }) => (
//           <FormItem>
//             <FormLabel className="font-bold">Quantity</FormLabel>
//             <FormControl>
//               <Input disabled={loading} placeholder="10" {...field} />
//             </FormControl>
//             <FormMessage />
//           </FormItem>
//         )}
//       />
//       <FormField
//         control={form.control}
//         name="productId"
//         render={({ field }) => (
//           <FormItem>
//             <FormLabel className="font-bold">Product</FormLabel>
//             <Select
//               disabled={loading}
//               onValueChange={field.onChange}
//               value={field.value}
//               defaultValue={field.value}
//             >
//               <FormControl>
//                 <SelectTrigger>
//                   <SelectValue
//                     defaultValue={field.value}
//                     placeholder="Select Product"
//                   />
//                 </SelectTrigger>
//               </FormControl>
//               <SelectContent>
//                 {products.map((product) => (
//                   <SelectItem value={product.id} key={product.id}>
//                     {/* <Image
//                                 src={product.images[0].url}
//                                 className="h-10 w-10 p-2 mr-2"
//                                 alt="product-image"
//                               /> */}

//                     {product.name}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//             <FormMessage />
//           </FormItem>
//         )}
//       />
//     </div>
//     <Button disabled={loading} className="ml-auto" type="submit">
//       Add Item
//     </Button>
//   </form>
// </Form>;
