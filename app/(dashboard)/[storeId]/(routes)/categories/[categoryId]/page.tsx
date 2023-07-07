import prismadb from '@/lib/prismadb';
import type { FC } from 'react';
import CategorieForm from './components/category-form';

interface CategoriePageProps {
  params: {
    storeId: string
    categoryId: string
  }
}

const CategoriePage = async ({
  params: {
    storeId,
    categoryId
  }
}: CategoriePageProps) => {
  const category = await prismadb.ecommerceCategory.findUnique({
    where: {
      id: categoryId
    }
  })

  const billboards = await prismadb.ecommerceBillboard.findMany({
    where: {
      storeId
    }
  })

  return (<div className='flex-col'>
    <div className="flex-1 space-y-4 p-8 pt-6">
      <CategorieForm billboards={billboards} initialData={category} />
    </div>
  </div>);
}

export default CategoriePage;
