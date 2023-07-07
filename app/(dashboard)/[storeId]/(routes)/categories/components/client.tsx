"use client"
import Heading from '@/components/custom/heading';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import type { FC } from 'react';
import { CategorieColumn, columns } from './columns';
import { Separator } from '@/components/ui/separator';
import { DataTable } from '@/components/custom/data-table';
import ApiList from '@/components/custom/api-list';

interface ClientProps {
  data: CategorieColumn[]
}

const Client: FC<ClientProps> = ({ data }) => {
  const router = useRouter()
  const params = useParams()
  return (<>
    <div className='flex items-center justify-between'>
      <Heading
        title={`Categories (${data.length})`}
        description="Manage categories for your store"
      />
      <Button onClick={() => {
        router.push(`/${params.storeId}/categories/new`)
      }}>
        <Plus className='mr-2 h-4 w-4' />
        Add New
      </Button>
    </div>
    <Separator />
    <DataTable columns={columns} data={data} searchKey='name' />
    <Heading
      title='API'
      description='API call for categories'
    />
    <Separator />
    <ApiList
      entityName='categories'
      entityIdName='categoryId'
    />
  </>);
}

export default Client;
