"use client"
import Heading from '@/components/custom/heading';
import { Button } from '@/components/ui/button';
import { EcommerceBillboard } from '@prisma/client';
import { Plus } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import type { FC } from 'react';
import { BillboardColumn, columns } from './columns';
import { Separator } from '@/components/ui/separator';
import { DataTable } from '@/components/custom/data-table';
import ApiList from '@/components/custom/api-list';

interface ClientProps {
  data: BillboardColumn[]
}

const Client: FC<ClientProps> = ({ data }) => {
  const router = useRouter()
  const params = useParams()
  return (<>
    <div className='flex items-center justify-between'>
      <Heading
        title={`Billboards (${data.length})`}
        description="Manage billboards for your store"
      />
      <Button onClick={() => {
        router.push(`/${params.storeId}/billboards/new`)
      }}>
        <Plus className='mr-2 h-4 w-4' />
        Add New
      </Button>
    </div>
    <Separator />
    <DataTable columns={columns} data={data} searchKey='label' />
    <Heading
      title='API'
      description='API call for billboards'
    />
    <Separator />
    <ApiList
      entityName='billboards'
      entityIdName='billboardId'
    />
  </>);
}

export default Client;
