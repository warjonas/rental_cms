import { format } from 'date-fns';
import { TestimonialClient } from './components/client';
import prismadb from '@/lib/prismadb';
import { TestimonialColumn } from './components/columns';

const TestimonialsPage = async ({
  params,
}: {
  params: { storeId: string };
}) => {
  const parameters = await params;
  const testimonials = await prismadb.testimonial.findMany({
    where: {
      storeId: parameters.storeId,
    },
  });

  const formattedTestimonials: TestimonialColumn[] = testimonials.map(
    (item) => ({
      id: item.id,
      clientName: item.clientName,
      message: item.message,
    }),
  );
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <TestimonialClient data={formattedTestimonials} />
      </div>
    </div>
  );
};

export default TestimonialsPage;
