import type { FC } from 'react';
import Client from './components/client';
import prismadb from '@/lib/prismadb';
import { BillboardColumn } from './components/columns';
import { format } from 'date-fns';

interface BillboardsProps {
  params: {
    storeId: string
  }
}

const Billboards = async ({ params }: BillboardsProps) => {
  const billboards = await prismadb.ecommerceBillboard.findMany({
    where: {
      storeId: params.storeId
    },
    orderBy: {
      createdAt: "desc"
    }
  })

  const formattedBillboards: BillboardColumn[] = billboards.map(item => {
    return {
      id: item.id,
      label: item.label,
      createdAt: format(item.createdAt, 'MMMM do, yyyy')
    }
  })
  return (<div className='flex-col'>
    <div className="flex-1 space-y-4 p-8 pt-6">
      <Client data={formattedBillboards} />
    </div>
  </div>);
}

export default Billboards;
