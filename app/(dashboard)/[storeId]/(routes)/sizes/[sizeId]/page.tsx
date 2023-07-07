import prismadb from '@/lib/prismadb';
import type { FC } from 'react';
import SizeForm from './components/size-form';

interface SizePageProps {
  params: {
    sizeId: string
  }
}

const SizePage = async ({
  params: {
    sizeId
  }
}: SizePageProps) => {
  const size = await prismadb.ecommerceSize.findUnique({
    where: {
      id: sizeId
    }
  })

  return (<div className='flex-col'>
    <div className="flex-1 space-y-4 p-8 pt-6">
      <SizeForm initialData={size} />
    </div>
  </div>);
}

export default SizePage;
