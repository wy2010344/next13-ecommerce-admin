import type { FC } from 'react';
import Client from './components/client';
import prismadb from '@/lib/prismadb';
import { CategorieColumn } from './components/columns';
import { format } from 'date-fns';

interface CategoriesProps {
  params: {
    storeId: string
  }
}

const Categories = async ({ params }: CategoriesProps) => {
  const categories = await prismadb.ecommerceCategory.findMany({
    where: {
      storeId: params.storeId
    },
    include: {
      billboard: true
    },
    orderBy: {
      createdAt: "desc"
    }
  })

  const formattedCategories: CategorieColumn[] = categories.map(item => {
    return {
      id: item.id,
      name: item.name,
      billboardLabel: item.billboard.label,
      createdAt: format(item.createdAt, 'MMMM do, yyyy')
    }
  })
  return (<div className='flex-col'>
    <div className="flex-1 space-y-4 p-8 pt-6">
      <Client data={formattedCategories} />
    </div>
  </div>);
}

export default Categories;
