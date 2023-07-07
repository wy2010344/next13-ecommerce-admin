import type { FC } from 'react';
import Client from './components/client';
import prismadb from '@/lib/prismadb';
import { OrderColumn } from './components/columns';
import { format } from 'date-fns';
import { formatter } from '@/lib/utils';

interface OrdersProps {
  params: {
    storeId: string
  }
}

const Orders = async ({ params }: OrdersProps) => {
  const orders = await prismadb.ecommerceOrder.findMany({
    where: {
      storeId: params.storeId
    },
    include: {
      orderItems: {
        include: {
          product: true
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  })

  const formattedOrders: OrderColumn[] = orders.map(item => {
    return {
      id: item.id,
      phone: item.phone,
      address: item.address,
      products: item.orderItems.map(orderItem => orderItem.product.name).join(', '),
      totalPrice: formatter.format(item.orderItems.reduce((total, item) => {
        return total + Number(item.product.price)
      }, 0)),
      isPaid: item.isPaid,
      createdAt: format(item.createdAt, 'MMMM do, yyyy')
    }
  })
  return (<div className='flex-col'>
    <div className="flex-1 space-y-4 p-8 pt-6">
      <Client data={formattedOrders} />
    </div>
  </div>);
}

export default Orders;
