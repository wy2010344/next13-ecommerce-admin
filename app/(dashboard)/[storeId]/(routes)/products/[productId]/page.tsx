import prismadb from '@/lib/prismadb';
import type { FC } from 'react';
import ProductForm from './components/product-form';

interface ProductPageProps {
  params: {
    storeId: string
    productId: string
  }
}

const ProductPage = async ({
  params: {
    storeId,
    productId
  }
}: ProductPageProps) => {
  const product = await prismadb.ecommerceProduct.findUnique({
    where: {
      id: productId
    },
    include: {
      images: true
    }
  })

  const categories = await prismadb.ecommerceCategory.findMany({
    where: {
      storeId
    }
  })
  const colors = await prismadb.ecommerceColor.findMany({
    where: {
      storeId
    }
  })
  const sizes = await prismadb.ecommerceSize.findMany({
    where: {
      storeId
    }
  })
  return (<div className='flex-col'>
    <div className="flex-1 space-y-4 p-8 pt-6">
      <ProductForm categories={categories} colors={colors} sizes={sizes} initialData={product} />
    </div>
  </div>);
}

export default ProductPage;
