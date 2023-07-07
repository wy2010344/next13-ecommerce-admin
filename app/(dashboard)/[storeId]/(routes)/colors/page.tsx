import type { FC } from 'react';
import Client from './components/client';
import prismadb from '@/lib/prismadb';
import { ColorColumn } from './components/columns';
import { format } from 'date-fns';

interface ColorsProps {
  params: {
    storeId: string
  }
}

const Colors = async ({ params }: ColorsProps) => {
  const colors = await prismadb.ecommerceColor.findMany({
    where: {
      storeId: params.storeId
    },
    orderBy: {
      createdAt: "desc"
    }
  })

  const formattedColors: ColorColumn[] = colors.map(item => {
    return {
      id: item.id,
      name: item.name,
      value: item.value,
      createdAt: format(item.createdAt, 'MMMM do, yyyy')
    }
  })
  return (<div className='flex-col'>
    <div className="flex-1 space-y-4 p-8 pt-6">
      <Client data={formattedColors} />
    </div>
  </div>);
}

export default Colors;
