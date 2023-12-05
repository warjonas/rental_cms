import prismadb from '@/lib/prismadb';
import React from 'react';
import FaqForm from './components/faq-form';

const FaqPage = async ({ params }: { params: { faqId: string } }) => {
  const faq = await prismadb.fAQ.findUnique({
    where: {
      id: params.faqId,
    },
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <FaqForm initialData={faq} />
      </div>
    </div>
  );
};

export default FaqPage;
