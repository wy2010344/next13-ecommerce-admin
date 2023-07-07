import type { FC } from 'react';
import Client from './components/client';
import prismadb from '@/lib/prismadb';
import { SizeColumn } from './components/columns';
import { format } from 'date-fns';

interface SizesProps {
  params: {
    storeId: string
  }
}

const Sizes = async ({ params }: SizesProps) => {
  const sizes = await prismadb.ecommerceSize.findMany({
    where: {
      storeId: params.storeId
    },
    orderBy: {
      createdAt: "desc"
    }
  })

  const formattedSizes: SizeColumn[] = sizes.map(item => {
    return {
      id: item.id,
      name: item.name,
      value: item.value,
      createdAt: format(item.createdAt, 'MMMM do, yyyy')
    }
  })
  return (<div className='flex-col'>
    <div className="flex-1 space-y-4 p-8 pt-6">
      <Client data={formattedSizes} />
    </div>
  </div>);
}

export default Sizes;
