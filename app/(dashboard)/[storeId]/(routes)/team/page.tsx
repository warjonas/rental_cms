import { format } from 'date-fns';
import { MemberClient } from './components/client';
import prismadb from '@/lib/prismadb';
import { MemberColumn } from './components/columns';

const MembersPage = async ({ params }: { params: { storeId: string } }) => {
  const members = await prismadb.teamMembers.findMany({
    where: {
      storeId: params.storeId,
    },
  });

  const formattedMembers: MemberColumn[] = members.map((item) => ({
    id: item.id,
    firstName: item.firstName,
    lastName: item.lastName,
    image: item.imageUrl,
    position: item.position,
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <MemberClient data={formattedMembers} />
      </div>
    </div>
  );
};

export default MembersPage;
