import { format } from 'date-fns';
import { FaqClient } from './components/client';
import prismadb from '@/lib/prismadb';
import { FaqColumn } from './components/columns';

const FaqsPage = async ({ params }: { params: { storeId: string } }) => {
  const faqs = await prismadb.fAQ.findMany({
    where: {
      storeId: params.storeId,
    },
  });

  const formattedFaqs: FaqColumn[] = faqs.map((item) => ({
    id: item.id,
    question: item.question,
    answer: item.answer,
  }));
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <FaqClient data={formattedFaqs} />
      </div>
    </div>
  );
};

export default FaqsPage;
