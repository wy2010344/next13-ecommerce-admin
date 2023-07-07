import type { FC } from 'react';
import Client from './components/client';
import prismadb from '@/lib/prismadb';
import { ProductColumn } from './components/columns';
import { format } from 'date-fns';
import { formatter } from '@/lib/utils';

interface ProductsProps {
  params: {
    storeId: string
  }
}

const Products = async ({ params }: ProductsProps) => {
  const products = await prismadb.ecommerceProduct.findMany({
    where: {
      storeId: params.storeId
    },
    include: {
      category: true,
      size: true,
      color: true
    },
    orderBy: {
      createdAt: "desc"
    }
  })

  const formattedProducts: ProductColumn[] = products.map(item => {
    return {
      id: item.id,
      name: item.name,
      isFeatured: item.isFeatured,
      isArchived: item.isArchived,
      price: formatter.format(item.price.toNumber()),
      category: item.category.name,
      size: item.size.name,
      color: item.color.value,
      createdAt: format(item.createdAt, 'MMMM do, yyyy')
    }
  })
  return (<div className='flex-col'>
    <div className="flex-1 space-y-4 p-8 pt-6">
      <Client data={formattedProducts} />
    </div>
  </div>);
}

export default Products;
