import prismadb from '@/lib/prismadb';
import React from 'react';
import MemberForm from './components/member-form';
import RegisterForm from './components/registerForm';

const MemberPage = async ({
  params,
}: {
  params: { memberId: string; storeId: string };
}) => {
  const customer = await prismadb.customer.findUnique({
    where: {
      id: params.memberId,
    },
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <RegisterForm initialData={customer} />
      </div>
    </div>
  );
};

export default MemberPage;
