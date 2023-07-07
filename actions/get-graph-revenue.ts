import prismadb from "@/lib/prismadb";

interface GraphData {
  name: string,
  total: number
}
export default async function getGraphRevenue(storeId: string) {
  const paidOrders = await prismadb.ecommerceOrder.findMany({
    where: {
      storeId,
      isPaid: true
    },
    include: {
      orderItems: {
        include: {
          product: true
        }
      }
    }
  })

  const monthlyRevenue: {
    [key: number]: number
  } = {}

  for (const order of paidOrders) {
    const month = order.createdAt.getMonth()
    let revenueForOrder = 0

    for (const item of order.orderItems) {
      revenueForOrder += item.product.price.toNumber()
    }
    monthlyRevenue[month] = (monthlyRevenue[month] || 0) + revenueForOrder
  }
  const graphData: GraphData[] = []
  for (let i = 0; i < 12; i++) {
    graphData[i] = {
      name: `X${i}`,
      total: monthlyRevenue[i] || 0
    }

  }
  return graphData
}