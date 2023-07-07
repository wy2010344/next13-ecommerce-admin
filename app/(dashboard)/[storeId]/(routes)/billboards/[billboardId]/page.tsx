import prismadb from '@/lib/prismadb';
import type { FC } from 'react';
import BillboardForm from './components/billboard-form';

interface BillboardPageProps {
  params: {
    billboardId: string
  }
}

const BillboardPage = async ({
  params: {
    billboardId
  }
}: BillboardPageProps) => {
  const billboard = await prismadb.ecommerceBillboard.findUnique({
    where: {
      id: billboardId
    }
  })

  return (<div className='flex-col'>
    <div className="flex-1 space-y-4 p-8 pt-6">
      <BillboardForm initialData={billboard} />
    </div>
  </div>);
}

export default BillboardPage;
