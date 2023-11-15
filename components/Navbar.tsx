import { MainNav } from '@/components/main-nav';
import StoreSwitcher from '@/components/store-switcher';
import { redirect } from 'next/navigation';
import { ModeToggle } from './theme-toggle';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getCurrentUser } from '@/actions/getCurrentUser';
import { LogOutIcon } from 'lucide-react';
import { signOut } from 'next-auth/react';
import { SignOutBtn } from './ui/signOutBtn';

const Navbar = async () => {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect('/sign-in');
  }

  const user = await getCurrentUser(session?.user?.email);

  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4">
        {user?.role === 'ADMIN' ? (
          <StoreSwitcher items={user?.stores} className="mr-5" />
        ) : (
          <div className="pr-10 pl-5">
            <h2 className="text-xl">{user?.stores[1].store.name}</h2>
          </div>
        )}

        <MainNav className="mx-6" />
        <div className="ml-auto flex items-center space-x-4">
          <ModeToggle />
          <SignOutBtn />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
