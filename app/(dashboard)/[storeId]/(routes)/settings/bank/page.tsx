import React from 'react';
import BankForm from './components/bank-form';
import prismadb from '@/lib/prismadb';

const BankDetails = async ({ params }: { params: { storeId: string } }) => {
  const initialData = await prismadb.storeBank.findFirst({
    where: {
      store: {
        id: params.storeId,
      },
    },
  });

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <BankForm initialData={initialData} />
    </div>
  );
};

export default BankDetails;
