"use client"
import Heading from '@/components/custom/heading';
import { Button } from '@/components/ui/button';
import { EcommerceOrder } from '@prisma/client';
import { Plus } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import type { FC } from 'react';
import { OrderColumn, columns } from './columns';
import { Separator } from '@/components/ui/separator';
import { DataTable } from '@/components/custom/data-table';
import ApiList from '@/components/custom/api-list';

interface ClientProps {
  data: OrderColumn[]
}

const Client: FC<ClientProps> = ({ data }) => {
  const router = useRouter()
  const params = useParams()
  return (<>
    <Heading
      title={`Orders (${data.length})`}
      description="Manage orders for your store"
    />
    <Separator />
    <DataTable columns={columns} data={data} searchKey='products' />
  </>);
}

export default Client;
