import prismadb from '@/lib/prismadb';
import { auth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import type { FC } from 'react';
import SettingForm from './components/setting-form';

interface SettingsProps {
  params: {
    storeId: string
  }
}

const Settings = async ({
  params
}: SettingsProps) => {
  const { userId } = auth()
  if (!userId) {
    redirect("/sign-in")
  }
  const store = await prismadb.eCommerceStore.findFirst({
    where: {
      id: params.storeId,
      userId
    }
  })
  if (!store) {
    redirect("/")
  }
  return (
    <div className='flex-col'>
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SettingForm initialData={store} />
      </div>
    </div>
  );
}

export default Settings;
