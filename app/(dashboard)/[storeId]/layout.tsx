import Navbar from '@/components/custom/navbar';
import prismadb from '@/lib/prismadb';
import { auth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import type { FC } from 'react';

interface DashboardLayoutProps {
  children: React.ReactNode
  params: {
    storeId: string
  }
}

const DashboardLayout = async ({
  children,
  params
}: DashboardLayoutProps) => {
  const { userId } = auth()
  if (!userId) {
    redirect('/sign-in')
  }
  const store = await prismadb.eCommerceStore.findFirst({
    where: {
      id: params.storeId,
      userId
    }
  })
  if (!store) {
    redirect('/')
  }
  return (<>
    <Navbar />
    {children}
  </>);
}

export default DashboardLayout;
