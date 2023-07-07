"use client"
import Heading from '@/components/custom/heading';
import { Button } from '@/components/ui/button';
import { EcommerceProduct } from '@prisma/client';
import { Plus } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import type { FC } from 'react';
import { ProductColumn, columns } from './columns';
import { Separator } from '@/components/ui/separator';
import { DataTable } from '@/components/custom/data-table';
import ApiList from '@/components/custom/api-list';

interface ClientProps {
  data: ProductColumn[]
}

const Client: FC<ClientProps> = ({ data }) => {
  const router = useRouter()
  const params = useParams()
  return (<>
    <div className='flex items-center justify-between'>
      <Heading
        title={`Products (${data.length})`}
        description="Manage products for your store"
      />
      <Button onClick={() => {
        router.push(`/${params.storeId}/products/new`)
      }}>
        <Plus className='mr-2 h-4 w-4' />
        Add New
      </Button>
    </div>
    <Separator />
    <DataTable columns={columns} data={data} searchKey='name' />
    <Heading
      title='API'
      description='API call for products'
    />
    <Separator />
    <ApiList
      entityName='products'
      entityIdName='productId'
    />
  </>);
}

export default Client;
