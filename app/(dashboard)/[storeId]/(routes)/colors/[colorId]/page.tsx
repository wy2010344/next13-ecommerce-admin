import prismadb from '@/lib/prismadb';
import type { FC } from 'react';
import ColorForm from './components/color-form';

interface ColorPageProps {
  params: {
    colorId: string
  }
}

const ColorPage = async ({
  params: {
    colorId
  }
}: ColorPageProps) => {
  const color = await prismadb.ecommerceColor.findUnique({
    where: {
      id: colorId
    }
  })

  return (<div className='flex-col'>
    <div className="flex-1 space-y-4 p-8 pt-6">
      <ColorForm initialData={color} />
    </div>
  </div>);
}

export default ColorPage;
