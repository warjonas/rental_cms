import prismadb from '@/lib/prismadb';
import { auth } from '@/app/auth';
import { redirect } from 'next/navigation';
import SettingsForm from './components/settings-form';
import { getCurrentUser } from '@/actions/getCurrentUser';
import { Separator } from '@/components/ui/separator';
import { UserClient } from './components/client';
import { getStoreUsers } from '@/actions/getUsersPerStore';
import { UserColumn } from './components/columns';

interface SettingsPageProps {
  params: {
    storeId: string;
  };
}

const SettingsPage: React.FC<SettingsPageProps> = async ({ params }) => {
  const session = await auth();

  if (!session?.user?.email) {
    redirect('/sign-in');
  }

  const user = await getCurrentUser(session?.user?.email);
  const storeUsers = await getStoreUsers(params.storeId);
  const storeUserFilters = storeUsers.filter((user) => {
    if (user.role !== 'ADMIN') {
      return true;
    }
    return false;
  });

  const formattedUsers: UserColumn[] = storeUserFilters.map((user) => ({
    id: user.id,
    name: user.firstName + ' ' + user.lastName,
    userType: user.role,
    email: user.email,
  }));

  const store = await prismadb.store.findFirst({
    where: {
      id: params.storeId,
    },
    include: {
      bank: true,
    },
  });

  if (!store) {
    redirect('/');
  }

  return (
    <div className="flex-col ">
      <div className="flex-1 spac-y-4 p-8 pt-6">
        <SettingsForm initialData={store} role={user?.role} bank={store.bank} />
        <Separator className="my-4" />
        <UserClient data={formattedUsers} />
      </div>
    </div>
  );
};

export default SettingsPage;
